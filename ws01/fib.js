function fib(n){
if(n <= 0 || arguments.length <= 0 || arguments.length >= 2 || isNaN(n))
return "undefined";

var first = 0, second = 1, third = 0;

for(var i = 0; i < n; i++)
{
first = third;
third = second;
second += first;
}
return third;
}

console.log(fib());
console.log(fib(1,2));
console.log(fib("hello"));
console.log(fib(10));
