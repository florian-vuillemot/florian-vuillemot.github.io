---
title: The SQL Over() function
description: An in-depth look at the SQL OVER() function with examples.
---

## Introduction

The SQL `OVER()` function is a powerful tool for performing complex calculations across a set of table rows related to the current row. It is commonly used for computing moving averages, cumulative sums, running totals, and other statistics.

## Data Example

To illustrate the concepts of `OVER`, let's use the following SQL data example:

```sql
CREATE TABLE personnages (
    name VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    strength INT NOT NULL
);

INSERT INTO personnages (name, type, strength) VALUES
('Asterix', 'Gaulois', 100),
('Obelix', 'Gaulois', 100),
('Cesar', 'Romain', 20),
('Brutus', 'Romain', 10),
('Ziguepus', 'Romain', 5),
('Panoramix', 'Gaulois', 50),
('Assurancetourix', 'Gaulois', 20),
('Abraracourcix', 'Gaulois', 80);
```

This table `personnages` contains characters from the famous comic series, categorized into two types: 'Gaulois' and 'Romain', with varying strengths. We will use this data to demonstrate how the SQL `OVER()` function works with partitions and frames.

**Note**: Tests are conducted using the Docker image of SQL Server 2022 (`mcr.microsoft.com/mssql/server:2022-latest`).

## Basic Concepts: Partitions and Frames

Partitions and frames are essential when working with the `OVER` function.
They can work together to define subsets of rows within a table, allowing you to perform calculations on specific groups of data.

### Partitions

A partition is a subset of a table's rows, grouped based on the values of a specific column.

#### In Our Example

There are two partitions: 'Gaulois' and 'Romain'.

### Windows (or Frames)

A window (or frame) is a dynamic subset of rows, defined by a specific number of preceding and following rows.

#### Types of Frames

- **Unbounded Frame**: Includes all preceding and following rows.
- **Unbounded Preceding**: Includes all preceding rows.
- **Unbounded Following**: Includes all following rows.
- **Bounded Frame**: Includes a specific number of preceding and following rows.

At each iteration, the frame adjusts based on the current row.

#### In Our Example

Let's consider a frame with 2 preceding rows and 1 following row.

| Iteration | Current Row      | Frame (Rows)                                      |
|-----------|------------------|---------------------------------------------------|
| 1         | Asterix          | Asterix, Obelix                                   |
| 2         | Obelix           | Asterix, Obelix, Panoramix                        |
| 3         | Panoramix        | Asterix, Obelix, Panoramix, Assurancetourix       |
| 4         | Assurancetourix  | Obelix, Panoramix, Assurancetourix, Abraracourcix |
| 5         | Abraracourcix    | Panoramix, Assurancetourix, Abraracourcix, Cesar  |
| 6         | Cesar            | Assurancetourix, Abraracourcix, Cesar, Brutus     |
| 7         | Brutus           | Abraracourcix, Cesar, Brutus, Ziguepus            |
| 8         | Ziguepus         | Cesar, Brutus, Ziguepus                           |


## The SQL `OVER` Clause

The `OVER` clause defines a window of rows for a query result set. Rows can be partitioned and ordered before applying the window function. This clause is used with functions to compute values like moving averages, cumulative sums, running totals, statistics, and plenty of other useful use cases.

### Some Examples

#### Simple `OVER`

The simple `OVER()` allows applying a function to the entire dataset acting as an unbounded window.

```sql
SELECT  name,
        type,
        strength,
        SUM(strength) OVER () AS sum_strength
FROM personnages;
```

With the output:

| name            | type    | strength | sum_strength |
|-----------------|---------|----------|--------------|
| Asterix         | Gaulois | 100      | 385          |
| Obelix          | Gaulois | 100      | 385          |
| Cesar           | Romain  | 20       | 385          |
| Brutus          | Romain  | 10       | 385          |
| Ziguepus        | Romain  | 5        | 385          |
| Panoramix       | Gaulois | 50       | 385          |
| Assurancetourix | Gaulois | 20       | 385          |
| Abraracourcix   | Gaulois | 80       | 385          |

#### `OVER` with `ORDER BY`

##### Unbounded

Let's now consider the `OVER` clause with an `ORDER BY` clause summing the `strength` row by row.

```sql
SELECT  name,
        type,
        strength,
        SUM(strength) OVER (ORDER BY type ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_force
FROM personnages;
```

With the output:

| name            | type    | strength | cumulative_force |
|-----------------|---------|----------|------------------|
| Asterix         | Gaulois | 100      | 100              |
| Obelix          | Gaulois | 100      | 200              |
| Panoramix       | Gaulois | 50       | 250              |
| Assurancetourix | Gaulois | 20       | 270              |
| Abraracourcix   | Gaulois | 80       | 350              |
| Cesar           | Romain  | 20       | 370              |
| Brutus          | Romain  | 10       | 380              |
| Ziguepus        | Romain  | 5        | 385              |

##### Bounded

But it can also be bounded to sum on a window of 2 rows before and 1 row after the current row.

```sql
SELECT  name,
        type,
        strength,
        SUM(strength) OVER (ORDER BY type ROWS BETWEEN 2 PRECEDING AND 1 FOLLOWING) AS windows_total_force
FROM personnages;
```

With the output:

| name            | type    | strength | windows_total_force |
|-----------------|---------|----------|---------------------|
| Asterix         | Gaulois | 100      | 200                 |
| Obelix          | Gaulois | 100      | 250                 |
| Panoramix       | Gaulois | 50       | 270                 |
| Assurancetourix | Gaulois | 20       | 250                 |
| Abraracourcix   | Gaulois | 80       | 170                 |
| Cesar           | Romain  | 20       | 130                 |
| Brutus          | Romain  | 10       | 115                 |
| Ziguepus        | Romain  | 5        | 35                  |

#### `OVER` with a Partition

```sql
SELECT  name,
        type,
        strength,
        SUM(strength) OVER (ORDER BY type) AS total_strength_by_type
FROM personnages;
```

With the output:

| name            | type    | strength | total_strength_by_type |
|-----------------|---------|----------|------------------------|
| Asterix         | Gaulois | 100      | 350                    |
| Obelix          | Gaulois | 100      | 350                    |
| Panoramix       | Gaulois | 50       | 350                    |
| Assurancetourix | Gaulois | 20       | 350                    |
| Abraracourcix   | Gaulois | 80       | 350                    |
| Cesar           | Romain  | 20       | 35                     |
| Brutus          | Romain  | 10       | 35                     |
| Ziguepus        | Romain  | 5        | 35                     |

#### `OVER` with a Partition and an `ORDER BY`

```sql
SELECT  name,
        type,
        strength,
        SUM(strength) OVER (PARTITION BY type ORDER BY name) AS total_strength_by_type_ordered
FROM personnages;
```

With the output:

| name            | type    | strength | total_strength_by_type_ordered |
|-----------------|---------|----------|-------------------------------|
| Abraracourcix   | Gaulois | 80       | 80                            |
| Assurancetourix | Gaulois | 20       | 100                           |
| Asterix         | Gaulois | 100      | 200                           |
| Obelix          | Gaulois | 100      | 300                           |
| Panoramix       | Gaulois | 50       | 350                           |
| Brutus          | Romain  | 10       | 10                            |
| Cesar           | Romain  | 20       | 30                            |
| Ziguepus        | Romain  | 5        | 35                            |


### Subtleties

Some behaviors can be surprising when using the `OVER` clause.
Let's take the following example where the Asterix character is duplicated in the table:

```sql	
SELECT  name,
        type,
        strength,
        SUM(strength) OVER (PARTITION BY type ORDER BY name) AS total_strength_by_type_ordered
FROM personnages;
```

With the output:

| line | name            | type    | strength | total_strength_by_type_ordered |
|------|-----------------|---------|----------|--------------------------------|
| 1    | Abraracourcix   | Gaulois | 80       | 80                             |
| 2    | Assurancetourix | Gaulois | 20       | 100                            |
| 3    | Asterix         | Gaulois | 100      | 300                            |
| 4    | Asterix         | Gaulois | 100      | 300                            |
| 5    | Obelix          | Gaulois | 100      | 400                            |
| 6    | Panoramix       | Gaulois | 50       | 450                            |
| 7    | Brutus          | Romain  | 10       | 10                             |
| 8    | Cesar           | Romain  | 20       | 30                             |
| 9    | Ziguepus        | Romain  | 5        | 35                             |

This behavior can be surprising and should be taken into account when using the `OVER` clause, as lines 3 and 4 provide the same aggregation due to the duplicate entry.
But this is not the case with an `ORDER BY` clause:

```sql
SELECT  name,
        type,
        strength,
        SUM(strength) OVER (PARTITION BY type ORDER BY name ROWS BETWEEN 2 PRECEDING AND 1 FOLLOWING) AS total_strength_by_type_ordered
FROM personnages;
```

With the output:

| name            | type    | strength | total_strength_by_type_ordered |
|-----------------|---------|----------|--------------------------------|
| Abraracourcix   | Gaulois | 80       | 100                            |
| Assurancetourix | Gaulois | 20       | 200                            |
| Asterix         | Gaulois | 100      | 300                            |
| Asterix         | Gaulois | 100      | 320                            |
| Obelix          | Gaulois | 100      | 350                            |
| Panoramix       | Gaulois | 50       | 250                            |
| Brutus          | Romain  | 10       | 30                             |
| Cesar           | Romain  | 20       | 35                             |
| Ziguepus        | Romain  | 5        | 35                             |


### Interesting Use Cases

The `OVER` clause can be used with a variety of functions to perform complex calculations on the result set. Here are some examples:
- [`CUME_DIST`](https://learn.microsoft.com/sql/t-sql/functions/cume-dist-transact-sql)
- [`PERCENT_RANK`](https://learn.microsoft.com/sql/t-sql/functions/percent-rank-transact-sql)
- [`LAG`](https://learn.microsoft.com/sql/t-sql/functions/lag-transact-sql)
- [`FIRST_VALUE`](https://learn.microsoft.com/sql/t-sql/functions/first-value-transact-sql)

These functions can be used to calculate the cumulative distribution, the percentage rank, the lag value, or the first value of a partition, among other use cases.

## Conclusion

Understanding the `OVER` function is fundamental to performing complex calculations on a result set. By defining partitions and frames, you can compute various statistics, moving averages, cumulative sums, and other valuable insights without doing a subquery or multiple SQL calls.
