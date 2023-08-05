from typing import Optional
from typing_extensions import Annotated
import typer
from pathlib import Path
from selector import get_selected_methods

from templates import Writer

app = typer.Typer()

cwd = Path.cwd()


@app.command()
def route(
    name: str,
    methods: Annotated[Optional[list[str]], typer.Argument(help="Add specific http methods")] = None,
    model: Annotated[bool, typer.Option('-m', '--model', help="Create a model")] = False,
):
    print(name, methods)
    writer = Writer(name)
    writer.write(methods, model)
    typer.echo(f"Created controller: {writer.controller_path}")


@app.command()
def model(name: str):
    print(f"Creating new model: {name}")


if __name__ == "__main__":
    app()
