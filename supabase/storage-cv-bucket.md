# Candidate CV Storage

Create a private Supabase Storage bucket named `candidate-cvs`.

Required policy intent:

- Public users must not list/read objects.
- Application submission service may upload server-side only.
- Admin CV download route must authorize Admin before reading or generating a short-lived signed download.
- Never store or return permanent public CV URLs.

Object path format:

```text
applications/{applicationId}/{cvFileId}.pdf
```
