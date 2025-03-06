import requests
from typing import Dict, Any
import json
import logging
from ..core.config import settings

logger = logging.getLogger(__name__)

class RecommenderClient:
    """Client for interacting with the external recommender system"""
    
    def __init__(self):
        # This could be moved to settings if needed
        self.recommender_url = "http://169.228.63.68:8000/predict/"
    
    async def get_recommendations(self, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get recommendations from the external recommender system
        
        Args:
            user_preferences: Dictionary containing user preferences
            
        Returns:
            Dictionary containing recommendations
        """
        try:
            # Convert user preferences to the format expected by the recommender
            data = {"text": json.dumps(user_preferences)}
            
            logger.info(f"Calling recommender system with data: {data}")
            
            # Make request to recommender system
            response = requests.post(self.recommender_url, json=data)
            response.raise_for_status()  # Raise exception for non-200 status codes
            
            result = response.json()
            logger.info(f"Received response from recommender system: {result}")
            
            # Return the recommendations
            return result
            
        except requests.RequestException as e:
            logger.error(f"Error calling recommender system: {str(e)}")
            raise ValueError(f"Failed to get recommendations: {str(e)}")
        except json.JSONDecodeError:
            logger.error("Invalid JSON response from recommender system")
            raise ValueError("Recommender system returned invalid response")