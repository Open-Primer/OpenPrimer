import json
import os

SYLLABUS = {
    "University": {
        "Bachelor": {
            "L1": {
                "Biology": {
                    "Cell Biology": [
                        "Introduction to the Cell",
                        "The Plasma Membrane",
                        "The Nucleus and Genetic Material",
                        "Mitosis and the Cell Cycle",
                        "Meiosis and Sexual Reproduction",
                        "Energy Transformation: Mitochondria and Chloroplasts"
                    ],
                    "Genetics": [
                        "Mendelian Inheritance",
                        "DNA Structure and Replication",
                        "Transcription and Translation",
                        "Gene Regulation"
                    ]
                },
                "Computer Science": {
                    "Introduction to Programming": [
                        "Variables and Data Types",
                        "Control Structures (If, Loops)",
                        "Functions and Scope",
                        "Arrays and Strings",
                        "Basic Algorithms (Sorting, Searching)"
                    ],
                    "Computer Architecture": [
                        "Binary and Data Representation",
                        "CPU and Memory Basics",
                        "Operating Systems Fundamentals"
                    ]
                },
                "Law": {
                    "Constitutional Law": [
                        "General Theory of the State",
                        "The Constitution and Hierarchy of Norms",
                        "Separation of Powers",
                        "The 5th Republic Institutions"
                    ]
                },
                "Physics": {
                    "Point Mechanics": [
                        "Kinematics: Position and Velocity",
                        "Newton's Laws of Motion",
                        "Energy and Work",
                        "Harmonic Oscillators"
                    ]
                },
                "Economics": {
                    "Macroeconomics": [
                        "Economic Aggregates (GDP, GNP)",
                        "Consumption and Investment Functions",
                        "Inflation and Unemployment",
                        "Fiscal and Monetary Policies"
                    ]
                }
            }
        }
    }
}

def save_syllabus(path="syllabus.json"):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(SYLLABUS, f, indent=4, ensure_ascii=False)
    print(f"Syllabus saved to {path}")

if __name__ == "__main__":
    save_syllabus()
