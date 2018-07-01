## Structured code with vanilla javascript?

I want to show how easy it is to develop a complex frontend application with just Vanilla JS. The biggest complaint I hear with Vanilla Javascript is lack of structure and it quickly becomes a mess. I don't think so and I have created these examples to show you how organized it can be..

This is a four step guide for Vanilla Javascript programming. 

## Introduction

I’ve been programming DOM manipulations with Javascript for 15 years and frontend development has always been fun in its own way. Even if I always had to give IE some special treatment.

## Javascript frameworks

For a few years ago a lot of things started to happen in the world of Javascript development. A lot of frontend javascript framework was born, hundreds of frameworks promising to be the new silver bullet for front end development(read: [there are no silver bullets](https://en.wikipedia.org/wiki/No_Silver_Bullet)). React is looking as the current most popular framework with a huge community. Though React is as most other frameworks, rather oppionated than focused on solving complex business problems. My issue with React is the complexity it comes with and that it abstracts away DOM manipulation. In fact with React, you are no longer in control of the DOM. These are two red flags for me. Most of the applications I develop are not Facebook scale either, and I also have to think about the lifetime and maintenance for the application. It may take three years before one of my client needs a new feature and I have to rebuild my project. Working with a three year old React project from time to time do look extremely painful for my mind. And my clients have to pay for the extra hours I need to setup my development environment again.

## Vanilla Javascript

With “Vanilla” or “normal” Javascript however, it is back to simplicity. Direct DOM manipulation with over 20 years old, mature and stable API. [getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) is still one of my favourite methods, though I also use the newer [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) and [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) more and more.

I’ve also only recently started to use Ecmascript 6. Mostly because browser compatibilty for it has become good only recently. And I have never been a fan of debugging transpiled code. Very few of my clients demand IE support these days. And I hardly have any trouble debugging transpiled code anymore, so the time to start with ES6 is definitely a good choice these days.

## Is is possible to have structured code when using vanilla JS?

I want to show how easy it is to develop a complex frontend application with just Vanilla JS. The biggest complaint I hear with Vanilla JS is lack of structure and it quickly becomes a mess. This is rather a team/management problem. Agreeing on how the code should be structured is something that everyone needs to agree on. As a developer you spend a lot of time of reading code, and the code you write should first foremost always be written in a way which is as most helpful as possible for the whole team. Solo developers / solo “rockstars” are those who create a mess.

The example I will show you, is a table with books and authors relation, with dialogs/modals for editing book/author objects. I will use classes, good old design patterns and template literals.

This is a three step guide for Vanilla Javascript programming. 

* [First guide is the static webpage.](https://github.com/olavgg/vanillajs/wiki/The-static-website-vanilla-javascript)

* [Second guide, Introduction to state management.](https://github.com/olavgg/vanillajs/wiki/State-management-with-the-observer-pattern)

* [Third guide is managing state with dynamic content.](https://github.com/olavgg/vanillajs/wiki/Add-dynamic-content-and-manage-state-with-vanilla-Javascript)

* [Fourth guide is solving DOM performance issues.](https://github.com/olavgg/vanillajs/wiki/Performance)