// export default class Function<In extends unknown[], Out extends unknown[]> {
//     bindableFunction: BindableFunction;

//     constructor() {
//         this.bindableFunction = new Instance("BindableFunction");
//     }

//     Bind(callback: (...args: In) => Out) {
//         this.bindableFunction.OnInvoke = callback;
//     }

//     Fire(...args: In): Out {
//         return this.bindableFunction.Invoke(...args);
//     }

//     Destroy() {
//         this.bindableFunction.Destroy();
//     }
// }
