# Test Cases: PostService.search()

| # | Technique | Input | Expected Outcome |
|---|-----------|-------|------------------|
| 1 | Black-box (equivalence: valid query with matches) | query "modularity", repository returns one matching post | Returns that post and hasMore false |
| 2 | Black-box (equivalence: valid query, no matches) | query with no matching posts | Returns an empty posts list, not an error |
| 3 | Black-box (boundary: default paging) | query only, no page given | Repository called with page 1 and pageSize 10 |
| 4 | Black-box (boundary: explicit page) | query with page 2 | Repository called with page 2 and pageSize 10 |
| 5 | White-box (branch: repository failure) | Repository rejects with an error | search() rejects with the same error, not swallowed |

Row 5 is white-box because the requirements never mention a database failure during search. We know the case matters because we read the code and saw search() has no error handling of its own, so any failure must reach the route's error handler.
