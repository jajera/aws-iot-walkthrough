---
inclusion: fileMatch
fileMatchPattern: "src/content/docs/**"
---

# Markdown Tables in MDX

Markdown tables (`| col | col |`) **do not render** in `.mdx` files that import custom components (e.g. `Tooltip`). The MDX parser treats pipe characters as text.

Use HTML tables instead:

```mdx
<table>
  <thead>
    <tr>
      <th>Tool</th>
      <th>Verify</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <Tooltip term="terraform" />
      </td>
      <td>
        <code>terraform version</code>
      </td>
    </tr>
  </tbody>
</table>
```
