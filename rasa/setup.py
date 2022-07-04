from setuptools import setup, find_packages

print (find_packages)

setup(
    name='extensions',
    version='1.0.0',
    install_requires=[],
    packages=find_packages(exclude=["tests"])
)