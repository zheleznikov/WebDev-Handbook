---
title: "Делаем промис - шаг 2"
slug: "create_my_promise_step2"
tags:
- async
- promises
- my_own_promise
author: Сергей Железников
date: 27-11-2025 
description: 
---
# Делаем промис - шаг 2

Продолжаем писать собственную реализацию промиса.
В этом шаге мы создадим функцию `then`.

## then
`then` принимает две функции-колбэка:
- onFulfilled — вызывается при успешном выполнении промиса,
- onRejected — вызывается при ошибке.

При этом then **всегда возвращает новый промис**. Это и позволяет строить цепочки.
Простейшая реализация могла бы выглядеть так:
```js
class MyPromise {
    /* ... констркутор итд */

    // наш then возвращает новый промис
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {

            if (onFulfilled) {
                // вызываем callback со значением исходного промиса
                const result = onFulfilled(this.value); 
                resolve(result);
            }

            if (onRejected) {/* сделаем позже*/}
        });
    }
}

```
На первый взгляд кажется, что всё почти готово, но такой вариант неправильный. Разберёмся почему.
### Проблема 1: обработчики `then` вызываются синхронно
Сейчас вызов `resolve(result)` происходит синхронно, хотя по спецификации колбэки `then` всегда должны выполняться асинхронно, через очередь микро-задач.
А сейчас у нас это работает так:
```js
new Promise(r => r(10)).then(console.log);
console.log("end");
```
```text
Вывод:
10
end
А должно быть наоборот
```
### Проблема 2: Мы не учитываем, что значение промиса может быть доступно не сразу
Вот пример, где это проявляется:
```js
new Promise(resolve => {
    setTimeout(() => {
        console.log("1 - вызываем resolve");
        resolve(100);
    }, 1000);
})
    .then(value => console.log("2) then получил " + value))
```
```text
Спустя 1 секунду вывод:
then получил - undefined
1 - вызываем resolve
```
Причина в том, что мы вызываем обработчик, сразу же, когда его добавили, а не когда промис завершился.
А нужно хранить обработчики и выполнять их после вызова `resolve`.

Исправим эти две проблемы.

### Вспомогательная функция для асинхронного вызова
Создадим функцию-обертку, чтобы вызывать задачи асинхронно.
```js
function runAsync(fn) { // принимает на вход другую фунцию
    queueMicrotask(fn); // и кладет ее в очередь микро-задач
}
```

### Обновим then
```js
class MyPromise {
    /* констркутор итд */

    then(onFulfilled, onRejected) { 
        return new MyPromise((resolve, reject) => {

            // создадим функцию-обработчик для колбэка onFulfilled
            const handleFillfilled = () => { 
                if (onFulfilled) {
                    const result = onFulfilled(this.value);
                    resolve(result);
                }
            }
            
            // далее решим, что делать с этой функцией обработчик в зависимости от состояния промиса
            if (this.state === "fulfilled") { // если промис выполнен успешно
                // то вызываем обработчик колбэка, но асинхронно
                runAsync(handleFillfilled); 
            }
            
            if (this.state === "pending") {
                // ЧТО ДЕЛАТЬ ЗДЕСЬ?
            }
            
            if (this.state === "rejected") {
                // напишем позже, когда напишем обработчик для колбэка onRejected 
            }


            if (onRejected) {/* сделаем позже*/}
        });
    }
}
```
Но чтобы это работало, нам нужно подготовить конструктор.
### Доработка конструктора: хранилища обработчиков

Когда промис находится в `pending`, мы не можем выполнить обработчики - их надо где-то хранить.
Для этого создадим в конструкторе два массива:
- `thenHandlers`,
- `catchHandlers`.

А при вызове `resolve()` и `reject()` — выполним все накопленные обработчики асинхронно.
```js
constructor(executor) { 
    this.state = "pending"; 
    this.value = undefined; 
    this.reason = undefined; 
    this.thenHandlers = []; // добавили массив для обработчиков fulfilled
    this.catchHandlers = []; // добавили массив для обработчиков reject
    
    const resolve = (value) => {
        if (this.state !== "pending") return;
        this.state = "fulfilled";
        this.value = value;
        runAsync(() => this.thenHandlers.forEach(callback => callback())); // выполняем асихронно все колбэки
    }
    
    const reject = (reason) => { 
        if (this.state !== "pending") return;
        this.state = "rejected";
        this.reason = reason;
        runAsync(() => this.catchHandlers.forEach(callback => callback())); // выполняем асихронно все колбэки 
    }
    
    // кроме этого сделаем более безопасным вызов executor - функции
    try {
       executor(resolve, reject); // вызываем функцию executor синхронно
    } catch(e) {
      reject(e);
    }
}
```
Теперь, если `then` вызвали в момент, когда промис ещё в `pending`, мы просто кладём обработчик в массив -
и позже `resolve()` их вызовет.
```js
if (this.state === "pending") {
    // ЧТО ДЕЛАТЬ ЗДЕСЬ?
    this.thenHandlers.push(handleFulfilled)
}
```

Так уже лучше: наш `then` уже работает асинхронно, и не выполняется если состояние "родительского" промиса pending.
Но к `then` есть еще требования:
1. Если на вход пришла не функция, а значение, то нужно это значение просто зарезолвить.
2. Должна быть обработка случая, когда результатом вызова onFulfilled является промис.

Реализуем первый пункт.
```js
const handleFulfilled = () => {
    // добавим проверку, функция ли пришла в качестве колбэка
    if (typeof onFulfilled !== "function") {
        // и если нет, то просто зарезолвим value
        resolve(this.value); 
        return;
    }   
    
    try { // сделаем вызов более безопасным
        const result = onFulfilled(this.value);
        resolve(result);                    
    } catch (e) {
        reject(e);
    }
}
```

## Проверяем, работает ли асинхронность и цепочки
```js
new MyPromise((resolve, reject) => {
    console.log("promise start");
    resolve(1);
}).then((value) => {
    console.log("then 1")
    console.log(value);
    return value + 1;
}).then((value) => {
    console.log("then 2")
    console.log(value);
});

console.log("sync")
```
```text
Вывод:
promise start
sync
then 1
1
then 2
2
```

## Итог
- `then` вызывается асинхронно,
- обработчики не теряются, если промис ещё в `pending`,
- цепочки работают,
- обработчики вызываются корректно в зависимости от состояния промиса,
- если передан не колбэк, значение просто пробрасывается дальше.

[Ссылка на весь код на CodePen](https://codepen.io/zheleznikov/pen/JoXvRqZ)

Но важной части пока не хватает:

> Что делать, если onFulfilled возвращает ещё один промис?

Это критический момент, сделаем это в шаге №3.