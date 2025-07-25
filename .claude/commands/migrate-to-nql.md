Migrate the queries used in: `$ARGUMENTS` from using Snowflake SQL to NQL.

# Migrating from SQL Queries to NQL Queries

This guide provides instructions for migrating React components from SQL-based data fetching to NQL-based queries using the `useNqlQuery` hook.

## Overview

NQL (Narrative Query Language) queries create temporary materialized views and then sample the data, requiring a different approach than direct SQL execution. The process involves:
1. Query submission → Job polling → Materialized view creation
2. Sample request → Job polling → Sample preparation  
3. Data fetching → Final results

## Step-by-Step Migration Process

### 1. Identify the Current Implementation

**Look for:**
- Direct SQL query execution (e.g., `useDatasetRows`, `useSqlQuery`)
- Components fetching tabular data with filters/transformations
- Data processing logic that could be moved to the database level

**Example Pattern:**
```typescript
// OLD: Direct data fetching + client-side processing
const { data: rawData } = useDatasetRows(datasetName);
const processedData = rawData?.map(row => /* complex processing */) || [];
```

### 2. Design the NQL Query

**Do:**
- Write pure SQL SELECT statements for the core query logic
- Use SQL aggregations, filters, and transformations instead of client-side processing
- Include appropriate WHERE clauses and LIMIT statements
- Use proper column aliases (e.g., `as label_value`)

**Don't:**
- Include CREATE MATERIALIZED VIEW statements (handled by `useNqlQuery`)
- Use database-specific syntax that's not supported in NQL
- Forget to handle NULL values and empty strings in WHERE clauses
- Don't use '*' anywhere
- Prefix tables with `company_data`

**Example:**
```sql
SELECT DISTINCT
    CONCAT_WS(' > ', CATEGORY, SUB_CATEGORY) as label_value
FROM company_data.{datasetName}
WHERE CONCAT_WS(' > ', CATEGORY, SUB_CATEGORY) IS NOT NULL
    AND CONCAT_WS(' > ', CATEGORY, SUB_CATEGORY) <> ''
LIMIT 1000
```

### 3. Create the NQL Hook

**Structure:**
```typescript
export function useCustomNqlQuery(
    // Stable primitive parameters
    param1: string | undefined,
    param2: number | null,
    // Complex objects (handle carefully)
    complexData: ComplexType[],
): QueryResult {
    // Extract stable dependencies first
    const stableDependency = useMemo(() => {
        return complexData.find(item => item.id === param1)?.relevantField;
    }, [param1, complexData]);

    // Build query with stable dependencies
    const nqlQuery = useMemo(() => {
        if (!param1 || !stableDependency) return "";
        
        return `
            SELECT column1, column2
            FROM dataset.${param1}
            WHERE condition = '${stableDependency}'
            LIMIT 1000
        `.trim();
    }, [param1, stableDependency]);

    const { data: rawData, error, isLoading } = useNqlQuery(nqlQuery, {
        enabled: !!nqlQuery,
    });

    // Memoize data transformation
    const transformedData = useMemo(() => {
        if (!rawData) return null;
        
        return rawData.map((row, index) => ({
            id: `${row.COLUMN1}_${index}`, // Stable, unique IDs
            value: String(row.COLUMN1 || row.column1 || ""),
            // ... other transformations
        }));
    }, [rawData]);

    return { data: transformedData, error, isLoading };
}
```

### 4. Handle Case Sensitivity

**Issue:** NQL results may return uppercase column names even if your query uses lowercase aliases.

**Solution:**
```typescript
// Handle both cases in data access
const value = String(row.LABEL_VALUE || row.label_value || "");
```

**Type Definition:**
```typescript
type NqlResult = {
    LABEL_VALUE?: string;  // Uppercase (what may be returned)
    label_value?: string;  // Lowercase (what you expect)
};
```

### 5. Optimize React Dependencies

**Critical Issues to Avoid:**

#### Infinite Re-renders
**Problem:** Large objects in dependencies cause constant re-computation
```typescript
// BAD: Entire array causes re-renders
const query = useMemo(() => buildQuery(), [largeArray]);
```

**Solution:** Extract only what you need
```typescript
// GOOD: Stable dependencies
const specificItem = useMemo(() => 
    largeArray.find(item => item.id === targetId), 
    [targetId, largeArray]
);
const query = useMemo(() => buildQuery(specificItem), [specificItem]);
```

#### Unstable Transforms
**Problem:** Data transformation creates new objects on every render
```typescript
// BAD: Creates new objects every render
const data = rawData?.map(row => ({ ...row, processed: true }));
```

**Solution:** Memoize transformations
```typescript
// GOOD: Stable object references
const data = useMemo(() => 
    rawData?.map(row => ({ ...row, processed: true })),
    [rawData]
);
```

### 6. Update Component Usage

**Replace old hook calls:**
```typescript
// OLD
const { data, isLoading, error } = useDatasetRows(datasetId);

// NEW  
const { data, isLoading, error } = useCustomNqlQuery(
    selectedAttribute,
    datasetName,
    referenceDatasets
);
```

**Update error handling:**
```typescript
// Handle NQL-specific errors
useEffect(() => {
    if (error) {
        dispatch({
            type: "ui/setError",
            payload: `Failed to load data: ${error.message}`,
        });
    }
}, [error, dispatch]);
```

### 7. Test and Debug

**Add Temporary Debugging:**
```typescript
console.log('[CustomNqlQuery] Query:', nqlQuery);
console.log('[CustomNqlQuery] Raw data:', rawData);
console.log('[CustomNqlQuery] Transformed:', transformedData);
```

**Monitor for:**
- Infinite re-renders (check browser console for repeated logs)
- Cache invalidation issues (datasets not appearing)
- Case sensitivity problems (undefined values in transforms)
- Performance issues (unnecessary re-computations)

**Remove debugging once stable**

## Common Pitfalls and Solutions

### 1. Infinite Loops
**Cause:** Unstable dependencies in useMemo/useCallback
**Solution:** Use primitive values or properly memoized objects as dependencies

### 2. Cache Issues  
**Cause:** New datasets not appearing in dropdowns
**Solution:** ~~Cache invalidation~~ Usually resolves automatically; avoid manual cache invalidation

### 3. Data Structure Mismatches
**Cause:** Expecting lowercase but getting uppercase column names
**Solution:** Handle both cases in data access and type definitions

### 4. Component Re-render Cascades
**Cause:** Parent components passing unstable props
**Solution:** Memoize expensive computations and use stable object references

## Best Practices

1. **Start with the simplest possible NQL query** and add complexity gradually
2. **Use browser dev tools** to monitor component re-renders and network requests
3. **Write TypeScript interfaces** that handle both uppercase and lowercase field names
4. **Memoize all data transformations** to prevent infinite loops
5. **Test with different datasets** to ensure robustness
6. **Keep query logic in the database** rather than client-side processing
7. **Use descriptive console logging** during development, remove in production

## Example Migration

### Before (SQL-based):
```typescript
const { data: datasetRows } = useDatasetRows(datasetName);
const uniqueLabels = useMemo(() => {
    // Complex client-side processing
    const values = new Map();
    datasetRows?.forEach(row => {
        const value = row[columnName];
        if (value) values.set(value, (values.get(value) || 0) + 1);
    });
    return Array.from(values.entries()).map(([value, count], index) => ({
        id: `label_${index}`,
        value,
        count
    }));
}, [datasetRows, columnName]);
```

### After (NQL-based):
```typescript
const { data: uniqueLabels } = useNqlLabelsQuery(
    selectedAttribute,
    datasetName, 
    referenceDatasets
);

// Much simpler - processing moved to database level
// Returns stable, memoized results
```

## Performance Benefits

- **Reduced client-side processing:** Complex logic handled at database level
- **Better caching:** Materialized views can be reused
- **Improved scalability:** Works with larger datasets without client memory issues
- **Consistent results:** Database-level processing ensures consistent output

## When NOT to Use NQL

- Simple, static queries that don't benefit from materialized views
- Real-time data requirements (due to polling overhead)
- Very small datasets where client-side processing is more efficient
- Cases where you need streaming or incremental updates