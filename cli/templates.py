import re
from pathlib import Path


cwd = Path.cwd()
src = cwd / 'src'

actions = {
    'list': 'list',
    'post': 'create',
    'get': 'get',
    'put': 'update',
    'delete': 'delete'
}

templates = {
    'routes': {
        'list': lambda name: f"router.get('/', {name})\n",
        'post': lambda name: f"router.post('/', {name})\n",
        'get': lambda name: f"router.get('/:id', {name})\n",
        'put': lambda name: f"router.put('/:id', {name})\n",
        'delete': lambda name: f"router.delete('/:id', {name})\n",
    },
    'models': {
        'import': lambda name: f"import {name.capitalize()} from '../models/{name.lower()}.model'",
    }
}


class Writer:
    def __init__(self, name: str):
        self.name = name
        self.controller_path = src / 'controllers' / f"{name.lower()}s.ctrl.ts"
        self.route_path = src / 'routes' / f"{name.lower()}s.route.ts"
        self.routes_index = src / 'routes' / 'index.ts'
        self.model_path = src / 'models' / f"{name.lower()}.model.ts"
        self.app_path = src / 'start' / 'app.ts'

    def write(self, methods: list[str] | None = None, model: bool = False):
        if not methods:
            methods = 'list post get put delete'.split()
        else:
            methods = [method.lower() for method in methods]
            methods.sort(key=lambda method: 'list post get put delete'.index(method))

        self.controller_path.write_text(self.controller_template(methods, model))
        self.route_path.write_text(self.route_template(methods, model))

        if model:
            self.model_path.write_text(self.model_template())

        self.append_to_index()
        self.append_to_app()

    def controller_template(self, methods: list[str], model: bool):
        template = "import { RequestHandler } from 'express'\n"
        if model:
            template += templates['models']['import'](self.name) + '\n'
        for method in methods:
            action = actions[method]
            controller = f"{action}{self.name.capitalize()}{'s' if action == 'list' else ''}"
            template += f"""
export const {controller}: RequestHandler = (req, res) => {{
  res.send('{method.upper()} {self.name}')
}}
"""
        return template

    def route_template(self, methods: list[str], model: bool):
        template = f"""import {{ Router }} from 'express'
import {{ {', '.join(f"{actions[method]}{self.name.capitalize()}{'s' if method == 'list' else ''}" for method in methods)} }} from '../controllers/{self.name.lower()}s.ctrl'
"""
        template += '\nconst router = Router()\n'

        for method in methods:
            controller = f"{actions[method]}{self.name.capitalize()}{'s' if method == 'list' else ''}"
            template += templates['routes'][method](controller)

        template += "\nexport default router\n"

        return template

    def model_template(self):
        model_name = self.name.capitalize()
        return f"""import {{ Schema, model, Types, Model }} from 'mongoose'
const {{ ObjectId }} = Types
import {{ z }} from 'zod'

export interface I{model_name} extends BaseModel {{
  name: string
}}

interface I{model_name}Methods {{}}

type {model_name}Doc = Model<I{model_name}, {{}}, I{model_name}Methods>

const {self.name}Schema = new Schema<I{model_name}, {model_name}Doc, I{model_name}Methods>(
  {{
    name: {{ type: String, required: true }},
  }},
  {{ timestamps: true }}
)

export default model<I{model_name}, {model_name}Doc>('{model_name}', {self.name}Schema)

export const {self.name}Body = z.object({{
  name: z.string().min(3).max(255)
}})
"""

    def append_to_index(self):
        content = self.routes_index.read_text()
        content += f"export {{ default as {self.name}sRouter }} from './{self.name.lower()}s.route'\n"
        self.routes_index.write_text(content)

    def append_to_app(self):
        content = self.app_path.read_text()
        content = re.sub(r"import { (.*) } from '../routes'",
                         r"import { \1, " + self.name + r"sRouter } from '../routes'", content)
        content_lines = content.splitlines(keepends=True)

        i = 0
        for i, line in enumerate(content_lines):
            if line.startswith('app.use(error)'):
                break

        content_lines.insert(i - 1, f"app.use('/api/{self.name.lower()}s', {self.name}sRouter)\n")

        self.app_path.write_text(''.join(content_lines))
