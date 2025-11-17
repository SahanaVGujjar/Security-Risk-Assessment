from sqlmodel import SQLModel, create_engine
from sqlmodel import Session
from sqlalchemy import text, inspect


sqlite_file_name = "app.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
    # Migrate existing database: Add new columns if they don't exist
    try:
        inspector = inspect(engine)
        
        # Check and migrate assessment table
        try:
            columns = [col['name'] for col in inspector.get_columns('assessment')]
            with Session(engine) as session:
                if 'approver_user_id' not in columns:
                    session.exec(text("ALTER TABLE assessment ADD COLUMN approver_user_id INTEGER"))
                    print("Added approver_user_id column")
                
                if 'is_new' not in columns:
                    session.exec(text("ALTER TABLE assessment ADD COLUMN is_new BOOLEAN DEFAULT 1"))
                    print("Added is_new column")
                
                session.commit()
        except Exception as e:
            print(f"Assessment migration check: {e}")
        
        # ScreeningAnswer table will be created by create_all if it doesn't exist
        # No migration needed as it's a new table
        
    except Exception as e:
        print(f"Migration check: {e}")
        # If table doesn't exist yet, that's fine - it will be created by create_all

def get_session():
    engine = create_engine("sqlite:///app.db", echo=True, connect_args={"check_same_thread": False})
    with Session(engine) as session:
        yield session
