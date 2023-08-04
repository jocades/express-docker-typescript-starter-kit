import typer
from pathlib import Path

app = typer.Typer()

cwd = Path.cwd()


class ControllerWriter:
    def __init__(self, name: str):
        self.name = name
        self.path = cwd / "controllers" / f"{name}.py"

    def write(self):
        contoller_content = f"""
import {{ RequestHandler }} from 'express'
import Group from '../models/group'
import {{ notFound }} from './factory'
"""

    def __repr__(self):
        return f"ControllerWriter(name={self.name}, path={self.path})"


@app.command()
def route(name: str):
    print(f"Creating new route: {name}")
    controller_path = cwd / "controllers" / f"{name}.py"


@app.command()
def model(name: str):
    print(f"Creating new model: {name}")


if __name__ == "__main__":
    app()
