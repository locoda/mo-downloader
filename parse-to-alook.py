import json
import base64
import re

with open('mo-downloader.alook', 'r') as f:
    mo_downloader = json.load(f)

with open('ldh-mo-img-dl.user.js', 'r') as f:
    code = f.read()

mo_downloader['version'] = re.search(r"version\s*([\d\.]*)", code).group(1)
mo_downloader['code'] =  base64.b64encode(code.encode('UTF-8')).decode('UTF-8')

with open("mo-downloader.alook", "w") as f:
    json.dump(mo_downloader, f, indent=2)