# Python Code File Improvement Instructions

**File to improve:** `$ARGUMENTS`

## Task: Improve Python Code File

Please analyze and improve the provided Python code file according to these guidelines:

### Core Principles:
1. **Maintainability First** - Code should be easy to understand, modify, and extend
2. **Performance** - Optimize for efficiency without sacrificing readability
3. **Pythonic Code** - Follow Python best practices and idioms (PEP 8, PEP 20)

### Specific Requirements:

#### File Organization:
- Keep files under 300 lines of code (LOC)
- If the file exceeds 300 LOC, split it into smaller, focused modules:
  - Separate classes into their own files
  - Extract utility functions into a `utils/` directory
  - Move constants to a `constants.py` file
  - Group related functionality in feature-based packages

#### Python Best Practices:
- Follow PEP 8 style guide for code formatting
- Use type hints for function signatures and variables
- Implement proper exception handling with specific exception types
- Use context managers (`with` statements) for resource management
- Prefer composition over inheritance
- Write docstrings for all functions, classes, and modules

#### Code Quality:
- Extract complex logic into separate functions
- Avoid deeply nested code (max 3-4 levels)
- Use descriptive variable and function names
- Remove unused imports and dead code
- Eliminate print statements and commented-out code
- Use constants for magic numbers and strings

#### Performance Optimizations:
- Use generators for large data processing
- Implement caching with `@lru_cache` for expensive computations
- Use list comprehensions and generator expressions appropriately
- Avoid premature optimization - profile first
- Use built-in functions and libraries over custom implementations
- Consider using `__slots__` for classes with many instances

#### Error Handling:
- Use specific exception types, not bare `except:`
- Implement proper logging instead of print statements
- Handle errors at the appropriate level
- Use custom exceptions for domain-specific errors
- Always clean up resources in finally blocks or use context managers

#### Testing & Documentation:
- Write docstrings following Google, NumPy, or Sphinx style
- Include usage examples in docstrings
- Make functions testable (avoid side effects)
- Keep functions small and focused (single responsibility)
- Use type hints to improve IDE support and catch errors

#### Unit Testing:
- Write unit tests for all public functions and methods
- Aim for at least 80% code coverage
- Use `pytest` or `unittest` framework consistently
- Follow the AAA pattern (Arrange, Act, Assert)
- Test edge cases, not just happy paths
- Use fixtures for test data setup
- Mock external dependencies (APIs, databases, file systems)
- Keep tests independent and isolated
- Use descriptive test names that explain what is being tested
- Group related tests in test classes
- Use parametrized tests for similar test cases
- Test both success and failure scenarios
- Ensure tests run quickly (mock slow operations)
- Place tests in a `tests/` directory mirroring source structure
- Use `conftest.py` for shared pytest fixtures

#### Strong Typing:
- **Never use `Any` type** - always specify concrete types
- Use type hints for all function parameters and return values
- Type all class attributes and instance variables
- Use `Union` or `|` (Python 3.10+) for multiple possible types
- Prefer `Optional[T]` over `Union[T, None]` for clarity
- Use `TypeVar` for generic functions and classes
- Leverage `Protocol` for structural subtyping
- Use `Literal` for specific string or numeric values
- Apply `@dataclass` or Pydantic models for data structures
- Use Pydantic for:
  - API request/response validation
  - Configuration management
  - Complex data validation with custom validators
  - Automatic serialization/deserialization
- Define custom types with `TypeAlias` for complex type signatures
- Use `mypy` in strict mode (`--strict`) for type checking
- Configure `pyproject.toml` with strict typing rules:
  ```toml
  [tool.mypy]
  strict = true
  warn_return_any = true
  warn_unused_configs = true
  disallow_untyped_defs = true
  disallow_any_explicit = true
  ```
- Replace `dict` with `TypedDict` or Pydantic models
- Use `Sequence`, `Mapping`, etc. instead of concrete types in parameters
- Type generator functions with `Generator[YieldType, SendType, ReturnType]`
- Use `cast()` sparingly and only when type narrowing isn't possible

### Output Format:
1. If the file is under 300 LOC, provide the improved version
2. If the file needs splitting, provide:
   - A file structure showing how to organize the code
   - The refactored main file
   - At least one example of an extracted module/class/utility
   - Example unit tests for the refactored code

### Additional Considerations:
- Preserve all existing functionality
- Add docstrings and inline comments for complex logic
- Use meaningful exception messages
- Follow the Zen of Python (import this)
- Consider backward compatibility if refactoring a library
- Use virtual environments and requirements.txt for dependencies
- Apply consistent naming conventions (snake_case for functions/variables)
- Always run `pylint` or `flake8` afterwards and fix any linting errors
- Run tests with `pytest -v` and ensure all pass
- Check test coverage with `pytest --cov`

Please analyze the code and provide your improvements with explanations for significant changes.