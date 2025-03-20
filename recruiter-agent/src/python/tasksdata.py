import json
from src.python.utils.Task import TaskDb, TaskExtractor
import morph
from morph import MorphGlobalContext


@morph.func(name='tasksdata')
def tasksdata(context:ModuleNotFoundError):
    DB_PATH = "./db/candidate.db"
    task_db = TaskDb(db_path=DB_PATH)
    tasks_list =task_db.get_tasks()
    task_counts = task_db.get_status_count()
    return json.dumps({"value": tasks_list, "counts":task_counts})
 
