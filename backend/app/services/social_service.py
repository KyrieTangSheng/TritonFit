from typing import Dict, Any
import logging
from .recommender_service import RecommenderClient

logger = logging.getLogger(__name__)

class SocialService:
    """Service for handling social network functionality"""
    
    def __init__(self):
        self.recommender_client = RecommenderClient()
    
    async def get_recommendations(self, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get personalized recommendations based on user preferences
        
        Args:
            user_preferences: Dictionary containing user preferences
            
        Returns:
            Dictionary containing recommendations
        """
        try:
            # Process user preferences if needed
            processed_preferences = self._process_preferences(user_preferences)
            
            # Get recommendations from the recommender system
            recommendations = await self.recommender_client.get_recommendations(processed_preferences)
            
            # Process recommendations if needed
            processed_recommendations = self._process_recommendations(recommendations)
            
            return processed_recommendations
            
        except Exception as e:
            logger.error(f"Error in social service: {str(e)}")
            raise ValueError(f"Failed to get social recommendations: {str(e)}")
    
    def _process_preferences(self, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process user preferences before sending to recommender
        
        This method can be expanded to transform the preferences as needed
        """
        # For now, just return the preferences as is
        return preferences
    
    def _process_recommendations(self, recommendations: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process recommendations received from the recommender
        
        This method can be expanded to transform the recommendations as needed
        """
        processed_recommendations = []
        for item in recommendations["items"]:
            processed_recommendations.append({
                "username": item["user_id"],        #TODO: change user_id to username after Letian's changes
                "similarity_score": item["score"]
            })
        return processed_recommendations
        