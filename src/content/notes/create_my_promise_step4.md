---
title: "Делаем промис - шаг 4"
slug: "create_my_promise_step4"
tags:
- async
- promises
- my_own_promise
author: Сергей Железников
date: 30-11-2025 
description: 
---
# Делаем промис - шаг 4

Продолжаем писать собственную реализацию промиса.
На этом шаге мы завершим работу над методом `then`, а именно напишем обработчик для колбэка `onRejected` и добавим метод `catch`.

### Напишем обработчик handleReject
```js
then(onFulfilled, onRejected) {
    /* .... другой код*/
    const handleReject = () => {
        if (typeof onRejected !== "function") {
            reject(this.reason);
            return;
        }

        try {
            const result = onRejected(this.reason);
            if (result instanceof MyPromise) {
                result.then(resolve, reject);
                return;
            }

            // важно, именно resolve
            resolve(result);


        } catch (e) {
            reject(e);
        }
    }
}


```
Здесь есть ключевой момент: в конце вызывается `resolve(result)`, а не `reject(result)`.

Почему так?

По спецификации Promise/A+, если обработчик `onRejected` **успешно обработал ошибку** (то есть не выбросил исключение),
то цепочка промисов должна перейти в состояние `fulfilled`.

Другими словами `onRejected` - это аналог блока catch в try/catch: ошибка обработана, выполнение продолжается нормально.

Пример поведения настоящих промисов:
```js
Promise.reject("error")
.then(null, (err) => {
    console.log("handled: ", err);
    return "ok"
})
.then(console.log);
// Вывод:
// handled error
// ok - цепочка стала успешной
```
Когда должен быть reject?
1. Если сам обработчик `onRejected` выбросил исключение

```js
catch(() => throw new Error("new fail"))
```
2. Если `onRejected` вернул промис, который перешел в состояние rejected.

### метод catch
Метод catch в промисах - это просто сокращённая форма `then`:
```js
promise.then(undefined, onRejected);
```
Поэтому его реализация выглядит так:
```js
catch(onRejected) {
    return this.then(undefined, onRejected);
}
```

Если успех обрабатывать не нужно, передаём undefined, а ошибку — в onRejected.

[Ссылка на весь код на CodePen](https://codepen.io/zheleznikov/pen/qEZYaGy)

Теперь наш промис умеет корректно работать
как с успешными результатами, так и с ошибками — почти как нативный.
В следующем шаге напишем метод `finally`.