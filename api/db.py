import asyncpg
import os

# Database connection parameters
DB_CONFIG = {
    'user': 'postgres',
    'password': 'Hollywood2026',
    'database': 'royalty_audit',
    'host': 'localhost',
    'port': 5432
}

# For compatibility with existing code that expects a database object
class Database:
    def __init__(self):
        self._pool = None
        self.is_connected = False
    
    async def connect(self):
        """Create a connection pool"""
        if not self._pool:
            try:
                self._pool = await asyncpg.create_pool(**DB_CONFIG)
                self.is_connected = True
                print("✅ Database connected successfully")
            except Exception as e:
                print(f"❌ Database connection error: {e}")
                raise
    
    async def disconnect(self):
        """Close the connection pool"""
        if self._pool:
            await self._pool.close()
            self._pool = None
            self.is_connected = False
            print("✅ Database disconnected")
    
    async def fetch_one(self, query, values=None):
        """Fetch a single row"""
        if not self._pool:
            await self.connect()
        async with self._pool.acquire() as conn:
            if values:
                return await conn.fetchrow(query, *values)
            return await conn.fetchrow(query)
    
    async def fetch_all(self, query, values=None):
        """Fetch all rows"""
        if not self._pool:
            await self.connect()
        async with self._pool.acquire() as conn:
            if values:
                return await conn.fetch(query, *values)
            return await conn.fetch(query)
    
    async def execute(self, query, values=None):
        """Execute a query"""
        if not self._pool:
            await self.connect()
        async with self._pool.acquire() as conn:
            if values:
                return await conn.execute(query, *values)
            return await conn.execute(query)

# Create database instance
database = Database()
