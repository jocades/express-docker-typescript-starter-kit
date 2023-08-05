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

route_templates = {
    'list': lambda name: f"router.get('/', {name})\n",
    'post': lambda name: f"router.post('/', {name})\n",
    'get': lambda name: f"router.get('/:id', {name})\n",
    'put': lambda name: f"router.put('/:id', {name})\n",
    'delete': lambda name: f"router.delete('/:id', {name})\n",
}


class Writer:
    def __init__(self, name: str):
        self.name = name
        self.controller_path = src / 'controllers' / f"{name.lower()}s.ctrl.ts"
        self.route_path = src / 'routes' / f"{name.lower()}s.route.ts"
        self.model_path = src / 'models' / f"{name.lower()}.model.ts"
        self.app_path = src / 'start' / 'app.ts'

    def write(self, methods: list[str] | None = None):
        if not methods:
            methods = 'list post get put delete'.split()
        else:
            methods = [method.lower() for method in methods]
            methods.sort(key=lambda method: 'list post get put delete'.index(method))

        self.controller_path.write_text(self.controller_template(methods))
        self.route_path.write_text(self.route_template(methods))

    def controller_template(self, methods: list[str]):
        template = "import { RequestHandler } from 'express'\n"
        for method in methods:
            action = actions[method]
            controller = f"{action}{self.name.capitalize()}{'s' if action == 'list' else ''}"
            template += f"""
export const {controller}: RequestHandler = (req, res) => {{
  res.send('{method.upper()} {self.name}')
}}
"""
        return template

    def route_template(self, methods: list[str] = []):
        template = f"""import {{ Router }} from 'express'
import {{ {', '.join(f"{actions[method]}{self.name.capitalize()}{'s' if method == 'list' else ''}" for method in methods)} }} from '../controllers/{self.name.lower()}s.ctrl'\n
const router = Router()\n
"""
        for method in methods:
            controller = f"{actions[method]}{self.name.capitalize()}{'s' if method == 'list' else ''}"
            template += route_templates[method](controller)

        template += "\nexport default router\n"

        return template
