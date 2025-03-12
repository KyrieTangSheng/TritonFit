import requests
from typing import Dict, Any, List
import json
import logging
from ..core.config import settings
import numpy as np
logger = logging.getLogger(__name__)

class RecommenderClient:
    """Client for interacting with the external recommender system"""
    
    def __init__(self):
        # This could be moved to settings if needed
        self.recommender_url = "http://169.228.63.68:8000/predict/"
    
    async def get_recommendations(self, user_preferences: Dict[str, Any],
                                other_users_preferences: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get recommendations from the external recommender system
        
        Args:
            user_preferences: Dictionary containing user preferences
            other_users_preferences: List of dictionaries containing other users' preferences
        Returns:
            Dictionary containing recommendations
        """
        try:
            # Create a copy of preferences without user_id for the recommender
            self_preferences_for_recommender = user_preferences.copy()
            if 'username' in self_preferences_for_recommender:
                self_preferences_for_recommender.pop('username')
            
            print(self_preferences_for_recommender)
            # Convert user preferences to the format expected by the recommender
            self_data = {"text": json.dumps(self_preferences_for_recommender)}
            
            similarities = []
            # Make request to recommender system for self
            self_response = requests.post(self.recommender_url, json=self_data)
            self_embedding = np.array([float(x) for x in eval(self_response.json()["embedding"][0]["embedding"])])
            
            # Process each other user
            for other_user_preference in other_users_preferences:
                # Extract user_id before sending to recommender
                other_user_name = other_user_preference.get('username')
                
                # Create a copy without user_id for the recommender
                other_user_for_recommender = other_user_preference.copy()
                if 'username' in other_user_for_recommender:
                    other_user_for_recommender.pop('username')
                
                other_user_data = {"text": json.dumps(other_user_for_recommender)}
                other_user_response = requests.post(self.recommender_url, json=other_user_data)
                other_user_embedding = np.array([float(x) for x in eval(other_user_response.json()["embedding"][0]["embedding"])])
                
                # Calculate similarity and store with user_id
                similarity_score = (self_embedding * other_user_embedding).sum(-1)
                similarities.append({
                    "username": other_user_name,
                    "similarity": similarity_score,
                    "preferences": other_user_preference
                })
            
            # Sort the similarities by the similarity score
            similarities.sort(key=lambda x: x["similarity"], reverse=True)
            # Get the top 10 recommendations
            recommendations = similarities[:10]
           # Return the recommendations
            print(recommendations)
            return recommendations
            
        except requests.RequestException as e:
            logger.error(f"Error calling recommender system: {str(e)}")
            raise ValueError(f"Failed to get recommendations: {str(e)}")
        except json.JSONDecodeError:
            logger.error("Invalid JSON response from recommender system")
            raise ValueError("Recommender system returned invalid response")