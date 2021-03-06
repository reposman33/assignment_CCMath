## Installation

Open a terminal and perform the following steps:

1. create the project: `git clone https://github.com/reposman33/assignment_CCMath.git`
2. cd to project root directory: `cd assignment_CCMath`
3. build the project: `npm i` (never mind the errors)
4. start the webserver: `npm run start`
5. open a browser tab and go to localhost:4200

---

1. Rendering the page takes some time. That's OK, but then, whenever you start typing into the filter box,
   that's also really slow. Try to find a way to make that faster.

2. Make the whole component more reactive using RxJS. Hints: AsyncPipe, ReactiveForms.

3. Implement a pager, so that you can see other result pages than just the first one.

4. I want to be able to enter multiple words (separated by space), and get all entries that contain (parts of) all
   of those words. Change the filter function so that this works correctly.

5. Apply any other improvements you can think of.
