---
title: "Делаем промис - шаг 5"
slug: "create_my_promise_step5"
tags:
- async
- promises
- my_own_promise
author: Сергей Железников
date: 07-12-2025 
description: 
---
# Делаем промис - шаг 5

Продолжаем писать собственную реализацию промиса. В этом шаге реализуем блок `finally`.

## Что известно о finally
Ключевые свойства:
1. `finally` можно вызвать всегда, внезависиомсти от того, чем завершился промис - успехом или ошибкой.
2. `finally` не получает аргументов: `value` или `reason`.
3. `finally` не изменяет результат цепочки. Кроме случаев, когда в `finally` произошла ошибка.
4. Если `finally` возвращает промис, то цепочка ждет его завершения, но после выполнения возвращается
оригинальная причина завершения - `value` или `reason`.

### Начинаем
Будем реализовывать `finally`, как частный случай `then`.
#### Если колбэк не функция
`finally` должен работать как `then`, но с прозрачным пропуском значения.

```js
finally(onFinally) {
    if (typeof onFinally !== "function") {
        return this.then(
            value  => value,
            reason => { throw reason; }
        );
    }
}

```
Если `onFinally` - не функция, то `finally` ничего не меняет и просто продолжает цепочку:
- Для fulfill-случая возвращаем исходное value.
- Для reject-случая пробрасываем reason.

#### Если onFinally — функция
```js
finally(onFinally) {
      
        /* .... */
    
  const handleFulfilled = (value) => { 
  }
  
  const handleReject = (reason) => { 
  }

  return this.then(handleFulfilled, handleReject);
}
```
Почему `handleFulfilled` принимает `value`?

Потому что `finally` должен вернуть оригинальный результат промиса - 
нужно сохранить и вернуть `value` после выполнения завершающего действия.

Почему handleReject принимает reason?

Аналогично: если исходный промис был отклонён, `finally`
должен пробросить исходную причину отказа (если только друг  сам `finally` не упадёт).

Реализуем `handleFulfilled`
```js
const handleFulfilled = (value) => {
    // вызываем переданный колбэк
    const result = onFinally();

    // если result — промис, то ждём его завершения
    if (result instanceof MyPromise) {
        // после завершения промиса возвращаем исходный value
        return result.then(() => value);
    }

    // если result не промис, просто возвращаем value
    return value;
}

```
Мы обязаны вернуть исходный value, потому `finally` не меняет успешный результат. А если вернулся промис, то `finally`
становится асинхронным: просто ждем завершения `result`.

Аналогично реализуем `handleReject`
```js
const handleReject = (reason) => {
    const result = onFinally();

    if (result instanceof MyPromise) {
        return result.then(() => {
            throw reason;
        });
    }

    throw reason;
};
```
Если `onFinally` возвращает промис, мы должны дождаться его выполнения, а после завершения пробросить исходный reason.
Важно обратить внимание, что мы вызываем `throw reason` именно в блоке `then`, чтобы бросить отклоненное значение.

### Итог
Блок `finally` готов:
- он не вмешивается в данные
- может быть асинхронным
- сохраняет оригинальное значение или причину ошибки
- только ошибки внутри самого finally могут изменить состояние цепочки

Теперь в вашей реализации промиса поддержаны все основные элементы Promise API: `then`, `catch` и `finally`.

[Ссылка на весь код на CodePen](https://codepen.io/zheleznikov/pen/dPMjmBM)

