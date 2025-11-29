from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from ...database.mysql import execute_query
from ...utils.logger import app_logger

class DashboardService:
    @staticmethod
    async def get_dashboard_summary(days: int = 30) -> Dict[str, Any]:
        """Get dashboard summary statistics"""
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Total complaints
            total_query = """
                SELECT COUNT(*) as total 
                FROM complaints 
                WHERE created_at BETWEEN %s AND %s
            """
            total_result = await execute_query(total_query, (start_date, end_date), single=True)
            
            # Status distribution
            status_query = """
                SELECT status, COUNT(*) as count 
                FROM complaints 
                WHERE created_at BETWEEN %s AND %s
                GROUP BY status
            """
            status_results = await execute_query(status_query, (start_date, end_date))
            status_distribution = {row['status']: row['count'] for row in status_results} if status_results else {}
            
            # Category distribution
            category_query = """
                SELECT category, COUNT(*) as count 
                FROM complaints 
                WHERE created_at BETWEEN %s AND %s
                GROUP BY category
            """
            category_results = await execute_query(category_query, (start_date, end_date))
            category_distribution = {row['category']: row['count'] for row in category_results} if category_results else {}
            
            # Recent complaints
            recent_query = """
                SELECT * FROM complaints 
                WHERE created_at BETWEEN %s AND %s
                ORDER BY created_at DESC 
                LIMIT 10
            """
            recent_complaints = await execute_query(recent_query, (start_date, end_date))
            
            return {
                "total_complaints": total_result['total'] if total_result else 0,
                "status_distribution": status_distribution,
                "category_distribution": category_distribution,
                "recent_complaints": recent_complaints or []
            }
            
        except Exception as e:
            app_logger.error(f"Error in get_dashboard_summary: {str(e)}")
            raise

    @staticmethod
    async def get_overview_stats() -> Dict[str, Any]:
        """Get overview statistics"""
        try:
            # Total complaints
            total_query = "SELECT COUNT(*) as total FROM complaints"
            total_result = await execute_query(total_query, single=True)
            
            # Status distribution
            status_query = "SELECT status, COUNT(*) as count FROM complaints GROUP BY status"
            status_results = await execute_query(status_query)
            status_distribution = {row['status']: row['count'] for row in status_results} if status_results else {}
            
            # Category distribution
            category_query = "SELECT category, COUNT(*) as count FROM complaints GROUP BY category"
            category_results = await execute_query(category_query)
            category_distribution = {row['category']: row['count'] for row in category_results} if category_results else {}
            
            # Recent complaints
            recent_query = "SELECT * FROM complaints ORDER BY created_at DESC LIMIT 5"
            recent_complaints = await execute_query(recent_query)
            
            return {
                "total_complaints": total_result['total'] if total_result else 0,
                "status_distribution": status_distribution,
                "category_distribution": category_distribution,
                "recent_complaints": recent_complaints or []
            }
            
        except Exception as e:
            app_logger.error(f"Error in get_overview_stats: {str(e)}")
            raise

    @staticmethod
    async def get_complaints(limit: int = 10, offset: int = 0) -> Dict[str, Any]:
        """Get paginated list of complaints"""
        try:
            # Get complaints with pagination
            query = """
                SELECT * FROM complaints 
                ORDER BY created_at DESC 
                LIMIT %s OFFSET %s
            """
            complaints = await execute_query(query, (limit, offset))
            
            # Get total count for pagination
            count_query = "SELECT COUNT(*) as total FROM complaints"
            count_result = await execute_query(count_query, single=True)
            
            return {
                "data": complaints or [],
                "total": count_result['total'] if count_result else 0,
                "limit": limit,
                "offset": offset
            }
            
        except Exception as e:
            app_logger.error(f"Error in get_complaints: {str(e)}")
            raise

# Create a singleton instance
dashboard_service = DashboardService()
