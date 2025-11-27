---
title: "Делаем промис - шаг 1"
slug: "create_my_promise_step1"
tags:
- async
- promises
- my_own_promise
author: Сергей Железников
date: 27-11-2025 
description: 
---
# Делаем промис - шаг 1

Задача - написать собственную реализацию промиса.

В этом шаге мы создадим класс промиса, его внутреннее состояние и опишем базовую структуру.

## Общая структура
```js

class MyPromise {
    
    constructor(executor) {  // Промис принимает функцию - executor 
        this.state = "pending"; // стартовое состояние
        this.value = undefined; // значение, с которым промис будетfulfilled 
        this.reason = undefined;  // причина ошибки для rejected
        
        const resolve = (value) => {} // реализуем ниже
        const reject = (reason) => {} // реализуем ниже

        executor(resolve, reject);  // вызываем функцию executor синхронно
    }
    
    then(onfulfilled, onRejected) {}
    
    catch(onRejected) {}
    
    finally(onFinalized) {}
}
```

## Реализация resolve и reject из конструктора
Начнём с простой версии resolve. Она должна перевести промис в состояние fulfilled и сохранить результат:
```js
const resolve = (value) => {
    this.state = "fulfilled";
    this.value = value
}
```
Однако по правилам промисов состояние можно изменить только один раз.
То есть вызовы resolve или reject после первого завершения должны игнорироваться. Чтобы это реализовать добавим проверку:
```js
const resolve = (value) => {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    this.value = value
}
```
Теперь аналогично реализуем `reject`:
```js
const reject = (reason) => {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.reason = reason
}
```

На этом этапе у нас есть самая базовая версия промиса — он может быть успешно выполнен или отклонён, и это состояние невозможно изменить повторно.
## Проверка работы
```js
// промис с resolve
const myPromiseStep1Resolve = new MyPromise((resolve, reject) => {
  resolve("hello promise");
});
console.log(myPromiseStep1Resolve.state); // fulfiilled
console.log(myPromiseStep1Resolve.value); // hello promise

// промис с reject
const myPromiseStepReject = new MyPromise((resolve, reject) => {
  reject("error in promise");
});
console.log(myPromiseStepReject.state); // rejected
console.log(myPromiseStepReject.reason); // error in promise
```

[Ссылка на весь код на CodePen](https://codepen.io/zheleznikov/pen/VYaxLmJ)

В следующей части мы реализуем блок `then` и обновим функции `resolve` и `reject`, чтобы поддерживать цепочки промисов.