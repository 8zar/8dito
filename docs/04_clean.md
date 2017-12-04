





# Clean pyc

```bash
find . -name "*.pyc" -exec rm -f {} \;
```

# Clean git local branches

```bash
git branch | grep -v "master" | xargs git branch -D 
```

# 