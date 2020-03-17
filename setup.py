# -*- coding: utf-8 -*-
import os
from setuptools import setup, find_packages


with open('README.rst') as f:
    readme = f.read()

with open('LICENSE') as f:
    license = f.read()


def traverse_folder(root, sub):
     paths = []
     for folder in os.walk(os.path.join(root, sub)):
         if not folder[1]:
             paths.append(folder[0])
             return paths
         else:
             for sub_folder in folder[1]:
                 paths.extend(traverse_folder(folder[0], sub_folder))
             return paths
     return paths

ROOT = os.path.abspath(os.path.dirname(__file__)) + '/jarhead'
sub_dirs = ['static', 'templates']

package_data = []

for dirs in sub_dirs:
    package_data.extend(traverse_folder(ROOT, dirs))

setup(
    name='jarhead',
    version='0.0.1',
    description="Jarhead is Alokin's common codebase",
    long_description=readme,
    author='Alokin Software Pvt Ltd',
    author_email='hello@alokin.in',
    url='http://www.alokin.in',
    license=license,
    packages=find_packages(exclude=('tests', 'docs')),
    package_data={'jarhead': [a + '/*' for a in package_data]}
)
