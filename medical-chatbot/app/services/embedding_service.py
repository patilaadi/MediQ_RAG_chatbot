from app.utils.helper import download_hugging_face_embeddings

def get_embeddings():

    embeddings = download_hugging_face_embeddings()

    return embeddings