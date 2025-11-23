---
title: "Event Loop"
slug: "event_loop"
author: Сергей Железников
date: 22-11-2025
tags:
- async
- event_loop
---
# Цикл событий

Event Loop — это цикл, который следит, чтобы JavaScript-код выполнялся по очереди.  
Он доставляет готовые задачи из очередей (task queue, microtask queue) в стек вызовов.  
Главная задача event loop — соединять однопоточный JS и асинхронные операции, которые выполняются в окружении.

## Как работает JavaScript + Event Loop

1. JavaScript запускает код — создаётся стек вызовов (call stack).
2. Асинхронные операции передаются в окружение (браузерные Web APIs или Node.js API).
3. Когда операция завершена, окружение помещает задачу в очередь:
    - макрозадачу — в task queue (например, после setTimeout)
    - микрозадачу — в microtask queue (например, после Promise.then)
4. Event Loop (часть окружения) непрерывно проверяет:
    - пуст ли стек?
    - есть ли микрозадачи?
    - есть ли макрозадачи?
5. Если стек пуст — event loop помещает следующую задачу в стек, и JS её выполняет.

## Что ещё важно

1. **Микрозадачи всегда выполняются первыми.**

На каждом тике:
- сначала выполняются все микрозадачи,
- затем одна макрозадача,
- затем снова микрозадачи, если появились.

2. **Микрозадачи появились вместе с Promise.**  
   Нужно было гарантировать, что `.then()` вызовется сразу после текущего кода, а не как `setTimeout(0)`.

## Event Loop в виде псевдо-кода

```js
const microtasks = [];
const tasks = [];

const queueMicrotask = (fn) => microtasks.push(fn);
const queueTask = (fn)  => tasks.push(fn);

const eventLoopTick = () =>  {

    while (microtasks.length > 0) {
        const microTask = microtasks.shift();
        microTask();
    }

    if (tasks.length > 0) {
        const macroTask = tasks.shift();
        macroTask();
    }
};

setInterval(eventLoopTick, 0);

queueTask(() => console.log("Макрозадача 1"));
queueMicrotask(() => console.log("Микрозадача A"));
queueMicrotask(() => console.log("Микрозадача B"));
queueTask(() => console.log("Макрозадача 2"));
queueMicrotask(() => console.log("Микрозадача C"));

/*
    Вывод:
    Микрозадача A
    Микрозадача B
    Микрозадача C
    Макрозадача 1
    Макрозадача 2
*/
