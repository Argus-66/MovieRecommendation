"""
Movie Recommendation Service using Python.
This service provides advanced movie recommendations using collaborative filtering.
"""

import os
import sys
import json
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load movie data from JSON file
def load_movies(file_path='./data/movies.json'):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Movie data file not found at {file_path}")
        return []
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {file_path}")
        return []

# Get random movie recommendations
def get_random_recommendations(movies, count=5, min_rating=6.0):
    """Get random movie recommendations with a minimum rating threshold."""
    eligible_movies = [movie for movie in movies if movie.get('vote_average', 0) >= min_rating]
    
    if not eligible_movies:
        return []
    
    # Random sample with replacement if we have fewer eligible movies than requested count
    if len(eligible_movies) < count:
        return random.choices(eligible_movies, k=count)
    
    # Random sample without replacement
    return random.sample(eligible_movies, k=count)

# Get content-based recommendations based on movie similarities
def get_similar_movies(movies, movie_id, count=5):
    """Get movie recommendations similar to a given movie based on content features."""
    # Find the target movie
    target_movie = next((movie for movie in movies if str(movie.get('id')) == str(movie_id)), None)
    
    if not target_movie:
        return []
    
    # Create a corpus of movie descriptions and genres for TF-IDF vectorization
    corpus = []
    
    for movie in movies:
        # Combine overview and genre names into a single text
        genre_text = ' '.join([genre.get('name', '') for genre in movie.get('genres', [])])
        combined_text = f"{movie.get('overview', '')} {genre_text} {movie.get('original_title', '')}"
        corpus.append(combined_text)
    
    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)
    
    # Find the index of the target movie
    target_idx = [i for i, movie in enumerate(movies) if str(movie.get('id')) == str(movie_id)][0]
    
    # Compute cosine similarity between the target movie and all movies
    cosine_similarities = cosine_similarity(tfidf_matrix[target_idx:target_idx+1], tfidf_matrix).flatten()
    
    # Get indices of similar movies (excluding the target movie)
    similar_indices = cosine_similarities.argsort()[::-1][1:count+1]
    
    return [movies[i] for i in similar_indices]

# Get recommendations based on genre preferences
def get_recommendations_by_preferences(movies, preferences, count=5):
    """Get movie recommendations based on user preferences (genres, year, minimum rating)."""
    # Extract preferences
    genre_ids = preferences.get('genres', [])
    year = preferences.get('year')
    min_rating = preferences.get('rating', 7.0)
    
    # Filter movies based on preferences
    filtered_movies = []
    
    for movie in movies:
        # Check if movie has minimum rating
        movie_rating = movie.get('vote_average', 0)
        if movie_rating < min_rating:
            continue
        
        # Check if movie matches genre preferences (if any)
        if genre_ids:
            movie_genre_ids = [genre.get('id') for genre in movie.get('genres', [])]
            if not any(genre_id in movie_genre_ids for genre_id in genre_ids):
                continue
        
        # Check if movie matches year preference (if any)
        if year:
            release_date = movie.get('release_date', '')
            if release_date and not release_date.endswith(str(year)):
                continue
        
        filtered_movies.append(movie)
    
    # Sort by popularity and rating
    filtered_movies.sort(key=lambda x: (x.get('vote_average', 0), x.get('popularity', 0)), reverse=True)
    
    # Return top results up to the requested count
    return filtered_movies[:count]

# Main function to process command-line arguments
def main():
    """
    Main function to process command-line arguments.
    Example usage:
        python recommendation_service.py random 5
        python recommendation_service.py similar 299536 5
        python recommendation_service.py preferences 28,12,878 2019 7.5 5
    """
    if len(sys.argv) < 2:
        print("Usage: python recommendation_service.py <command> [args...]")
        sys.exit(1)
    
    # Load movies
    movies = load_movies()
    
    if not movies:
        print("Error: No movie data available.")
        sys.exit(1)
    
    # Process commands
    command = sys.argv[1]
    
    if command == "random":
        count = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        recommendations = get_random_recommendations(movies, count)
        print(json.dumps(recommendations, indent=2))
    
    elif command == "similar":
        if len(sys.argv) < 3:
            print("Error: Movie ID required for similar recommendations.")
            sys.exit(1)
        
        movie_id = sys.argv[2]
        count = int(sys.argv[3]) if len(sys.argv) > 3 else 5
        recommendations = get_similar_movies(movies, movie_id, count)
        print(json.dumps(recommendations, indent=2))
    
    elif command == "preferences":
        if len(sys.argv) < 3:
            print("Error: Preferences required.")
            sys.exit(1)
        
        genres = [int(g) for g in sys.argv[2].split(',')] if sys.argv[2] != "null" else []
        year = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] != "null" else None
        rating = float(sys.argv[4]) if len(sys.argv) > 4 else 7.0
        count = int(sys.argv[5]) if len(sys.argv) > 5 else 5
        
        preferences = {
            "genres": genres,
            "year": year,
            "rating": rating
        }
        
        recommendations = get_recommendations_by_preferences(movies, preferences, count)
        print(json.dumps(recommendations, indent=2))
    
    else:
        print(f"Error: Unknown command '{command}'.")
        sys.exit(1)

if __name__ == "__main__":
    main() 