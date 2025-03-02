import glob
from add_new_candidate import add_new_cand_from_json, extract_candidate_info
from add_new_note import extract_notes_from_call, add_new_note_from_json
from add_new_work_experience import extract_work_experiences_from_call, add_work_experience_from_json
from vector_embeddings import create_new_vector_embedding

DB_PATH = "candidate.db"

candidate_text_files = glob.glob("data/text_minutes/*.txt")
print(candidate_text_files)

for text_extract in candidate_text_files:
    # read transcript file
    with open(text_extract, "r") as file:
        transcript = file.read()

    # extract basic info
    basic_info_json = extract_candidate_info(transcript=transcript)
    new_id = add_new_cand_from_json(db_path=DB_PATH, candidate_json=basic_info_json)

    # extraact meeting notes
    notes_json = extract_notes_from_call(transcript=transcript)
    _, next_action = add_new_note_from_json(
        db_path=DB_PATH,
        candidate_id=new_id,
        notes_json=notes_json,
    )

    # extract structured work experience
    work_experience = extract_work_experiences_from_call(transcript=transcript)
    add_work_experience_from_json(db_path=DB_PATH, candidate_id=new_id, work_exp_json=work_experience)

    print(f"New record added for {basic_info_json['first_name']} {basic_info_json['last_name']} with ID {new_id}")

    # enter into embedding space
    create_new_vector_embedding(candidate_id=new_id)
