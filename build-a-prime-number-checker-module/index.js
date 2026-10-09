
function isPrime(num){
    if (num <= 1) return false;
    
    if (num === 2 || num === 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    const checker = Math.sqrt(num);
    for (let i = 5; i <= checker; i += 2) {
        if (num % i === 0) {
            return false; 
        }
    }
    return true;
}

module.exports = {
    isPrime: isPrime
}