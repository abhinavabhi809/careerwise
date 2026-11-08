from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from docx import Document
import io
import re
import json
import os


# ==========================================
# CareerWise API
# ==========================================

app = FastAPI(title="CareerWise API")


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://careerwise-seven.vercel.app", "https://careerwise-git-main-abhinavabhi809-5435.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Skills Database
# ==========================================

SKILLS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "php",
    "ruby",
    "go",
    "kotlin",
    "swift",

    "html",
    "css",
    "react",
    "angular",
    "vue",
    "node.js",
    "express",
    "next.js",

    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "oracle",
    "sqlite",

    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data analysis",
    "data science",

    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",

    "git",
    "github",
    "docker",
    "aws",
    "azure",

    "rest api",
    "fastapi",
    "django",
    "flask"
]


# ==========================================
# Find Skills
# ==========================================

def find_skills(text):

    text_lower = text.lower()

    found_skills = []

    for skill in SKILLS:

        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text_lower):

            found_skills.append(skill)

    return found_skills


# ==========================================
# Load Career Roles
# ==========================================

def load_career_roles():

    base_dir = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    file_path = os.path.join(
        base_dir,
        "data",
        "career_roles.json"
    )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


# ==========================================
# Career Matching Algorithm
# ==========================================

def match_careers(user_skills):

    career_roles = load_career_roles()

    recommendations = []

    user_skills_set = set(
        skill.lower()
        for skill in user_skills
    )

    for career in career_roles:

        required_skills = [
            skill.lower()
            for skill in career["required_skills"]
        ]

        matched_skills = [
            skill
            for skill in required_skills
            if skill in user_skills_set
        ]

        missing_skills = [
            skill
            for skill in required_skills
            if skill not in user_skills_set
        ]

        if len(required_skills) > 0:

            match_score = (
                len(matched_skills)
                / len(required_skills)
            ) * 100

        else:

            match_score = 0

        recommendations.append({

            "career": career["title"],

            "match_score": round(match_score),

            "matched_skills": matched_skills,

            "missing_skills": missing_skills

        })


    # Sort highest match first

    recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return recommendations


# ==========================================
# Home Endpoint
# ==========================================

@app.get("/")
def home():

    return {
        "message": "CareerWise backend is running!"
    }


# ==========================================
# Resume Upload Endpoint
# ==========================================

@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    file_content = await file.read()

    filename = file.filename.lower()

    text = ""


    # --------------------------------------
    # PDF
    # --------------------------------------

    if filename.endswith(".pdf"):

        pdf = PdfReader(
            io.BytesIO(file_content)
        )

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:

                text += page_text + "\n"


    # --------------------------------------
    # DOCX
    # --------------------------------------

    elif filename.endswith(".docx"):

        document = Document(
            io.BytesIO(file_content)
        )

        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )


    # --------------------------------------
    # Unsupported File
    # --------------------------------------

    else:

        return {
            "error": "Only PDF and DOCX files are supported."
        }


    # --------------------------------------
    # Detect Skills
    # --------------------------------------

    skills = find_skills(text)


    # --------------------------------------
    # Match Careers
    # --------------------------------------

    career_recommendations = match_careers(
        skills
    )


    # --------------------------------------
    # Return Results
    # --------------------------------------

    return {

        "filename": file.filename,

        "text": text,

        "skills": skills,

        "skill_count": len(skills),

        "career_recommendations":
            career_recommendations

    }