# orders-api demo

A small Express orders API used to demonstrate the [CodeITronics AI PR Reviewer](https://github.com/codeitronics/ai-pr-reviewer).

Open the pull requests tab to see the reviewer at work: the "Add order search, discounts and an admin export" PR contains realistic mistakes (an injectable query, a missing `await`, an off-by-one in pagination, a logged secret, and a discount that can make totals negative), and the AI review comments on each of them.

**This code contains deliberate bugs. Don't copy it.**

```bash
npm install
npm test
npm start
```

The workflow in `.github/workflows/ai-review.yml` runs the reviewer on every pull request.
