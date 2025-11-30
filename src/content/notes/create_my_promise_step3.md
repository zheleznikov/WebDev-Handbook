---
title: "Делаем промис - шаг 3"
slug: "create_my_promise_step3"
tags:
- async
- promises
- my_own_promise
author: Сергей Железников
date: 29-11-2025 
description: 
---
# Делаем промис - шаг 3

Продолжаем писать собственную реализацию промиса.
В этом шаге разберём, что происходит, если колбэк, переданный в `then`, возвращает промис.

### Сейчас блок then выглядит так:
```js
then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
    
        const handleFulfilled = () => { 
            if (typeof onFulfilled !== "function") { 
                resolve(this.value);
                return;
            }   
            
            try { 
                const result = onFulfilled(this.value);
                if (result instanceof MyPromise) {
                    // что делать в этом случае?
                } else {
                    resolve(result);
                }
                              
            } catch (e) {
                reject(e);
            }
        }
        
       
        if (this.state === "fulfilled") {
            runAsync(handleFulfilled); 
        }
        
        if (this.state === "pending") {
            this.thenHandlers.push(handleFulfilled);
        }
        
        if (this.state === "rejected") {
            // напишем позже, когда напишем обработчик для колбэка onRejected 
        }
    
    
        if (onRejected) {}
    });
}

```
Напомним, кто есть кто здесь:
- `this` - **предыдущий** промис в цепочке
- `onFulfilled` - колбэк пользователя **этого** then
- `result` - то, что вернул onFulfilled
- `resolve/reject` - функции, которые меняют состояние **нового** промиса


## Когда result - промис
Представим цепочку:
```js
getUser()
    .then(user => getOrders(user.id)) // возвращается промис
    .then(orders => console.log(orders));
```
Здесь важно, чтобы:
- второй `then` дождался завершения вызова `getOrders(...)`;
- получил не сам промис, а его **результат** - список заказов;
- если `getOrders` завершится ошибкой, эта ошибка корректно ушла дальше по цепочке.

### Что это означает для реализации?
В случае, если result вернул промис, то обрабатываем это так:
```js
result.then(resolve, reject);
```
- когда result выполнится - вызвать `resolve(value)` для нового промиса
- когда result завершится с ошибкой - вызвать `reject(reason)`.

Так мы и передаём состояние между промисами.

В следующей части реализуем `onRejected`.