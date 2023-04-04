// Load math.js
const math = require("mathjs");
const crypto = require('crypto');

var q = 89; // must be Sophie Germain prime number
var p = 2 * q + 1; // prime too
var g;
var G = []; // Array containing all G

class myRing {
  constructor(pKeys) {
    this.pKeys = pKeys;
    this.n = pKeys.length;
  }
}

class myUser {
  constructor(id, g, G, q) {
    this.x = Math.floor(Math.random() * (q - 1));
    this.y = fastpow(g, this.x, 2 * q + 1);
    this.Pkeys = { g: g, y: this.y, G: G };
    this.Skeys = { Pkey: this.Pkeys, x: this.x };
    this.id = id;
  }
}

function myCreateRing(n, g, G, q) {
  var pKeys = [];
  var userArray = [];

  for (let i = 0; i < n; i++) {
    var user = new myUser(i, g, G, q);
    pKeys[i] = user.Pkeys;
    userArray[i] = user;
  }
  var ring = new myRing(pKeys);
  return [ring, userArray];
}

function findCoprimeList(n) {
  var coprimeList = [];
  for (let i = 2; i < n; i++) {
    if (math.gcd(i, n) == 1) {
      coprimeList.push(i);
    }
  }
  return coprimeList;
}

function fastpow(b, e, m) {
  let result = 1;
  b = b % m;
  // //console.log("b: ", b);
  while (e > 0) {
    if (e % 2 == 1) {
      result = (result * b) % m;
    }
    e = Math.floor(e / 2);
    // //console.log("e: ", e);
    b = (b * b) % m;
    // //console.log("b: ", b);
  }
  return result;
}

function buildG() {
  var primfac = [2, q]; // prime factors of p-1
  var generatorFound = false;
  let x = 1;

  while (!generatorFound) {
    // while to search the first generator x
    generatorFound = true;
    x += 1;
    for (let pi of primfac) {
      //if (Math.pow(x, parseInt((p - 1) / pi)) % p == 1) {
      if (fastpow(x, parseInt((p - 1) / pi), p) == 1) {
        generatorFound = false;
      }
    }
  }

  var generators = [x];
  // //console.log("generators: ", generators);
  var coprimeList = findCoprimeList(p - 1);
  // //console.log("coprimeList: ", coprimeList);
  for (let qi of coprimeList) {
    generators.push(Math.pow(x, qi) % p);
  }
  // //console.log("generators: ", generators);
  generators.sort((a, b) => a - b);
  ////console.log("generators sorted: ", generators);

  var G_tmp = [];
  var g = generators[1];
  g = Math.pow(g * g, 1) % p;

  for (let qi = 0; qi < q; qi++) {
    ////console.log("fastpow(", g, ",", qi,") % ", p,": ",      fastpow(g, qi, p));
    G_tmp.push(fastpow(g, qi, p));
  }
  G_tmp.sort((a, b) => a - b);

  return [G_tmp, g];
}

function Hash(issue, publicKeys, g, p, q) {
  let s = issue;
  /* for (let keys of publicKeys) {
    s += keys;
  } */
  //console.log("s: ", JSON.stringify(s));
  //console.log("s.charCodeAt(0): ", s.charCodeAt(0));
  //console.log("s.charCodeAt(0).toString(2): ", s.charCodeAt(0).toString(2));
  var binary = s.charCodeAt(0).toString(2);
  //console.log("binary: ", binary);
  let hashed = parseInt(crypto.createHash('sha1').update(binary).digest('hex'), 16);
  //console.log("hashed: ", hashed);
  ////console.log("getBaseLog(3, hashed): ", getBaseLog(2, hashed));
  ////console.log("Math.pow:", Math.pow(2, 156.22504296509652));
  hashed = fastpow(g, fastpow(hashed, 1, q), p);
  //console.log("hashed pow: ", hashed)
  return hashed;
}

function HashPrime(issue, publicKeys, g, p, q, m) {
  let s = issue;
  s += m;
  //console.log("s: ", s)
  var binary= '';
  binary = s.split('').map(char => {
      return char.charCodeAt(0).toString(2);
   }).join("");
  //console.log("binary: ", binary);
  let hashed = parseInt(crypto.createHash('sha1').update(binary).digest('hex'), 16);
  //console.log("hashed: ", hashed);
  hashed = fastpow(g, fastpow(hashed, 1, q), p);
  //console.log("hashed fast: ", hashed);
  return hashed;
}

function HashPrimePrime(issue, message, publicKeys, g, p, q, A_0, A_1, a, b) {
  let s = issue;
  /* for (let keys of publicKeys) {
    s += keys;
  } */
  //console.log("A_0: ", A_0);
  //console.log("A_1: ", A_1);
  s = s + A_0 + A_1 + message;
  //console.log("s: ", s)
  //console.log("a: ", a)
  //console.log("b: ", b)
  a = a.concat(b);
  for (let n in a) {
    //console.log("a[n]: ", a[n]);
    s = s + a[n];
  }
  //console.log("s+n: ", s)
  binary = s.split('').map(char => {
      return char.charCodeAt(0).toString(2);
  }).join("");
  //console.log("binary: ", binary);
  let hashed = parseInt(crypto.createHash('sha1').update(binary).digest('hex'), 16);
  hashed = fastpow(hashed, 1, q);
  //console.log("hashed fast: ", hashed);
  return hashed;
}

function Sign(message, issue, publicKeys, user, G, g, userArray) {
  var n = publicKeys.length;
  var i = user.id;
  var sigma = new Array(n).fill(null);
  var hashed = Hash(issue, publicKeys, g, p, q);
  console.log("hashed: ", hashed);
  sigma[i] = fastpow(hashed, user.x, p);
  console.log("sigma[", i, "]: ", sigma[i]);
  var A_0 = HashPrime(issue, publicKeys, g, p, q, message);
  console.log("A_0: ", A_0);
  var A_1 = fastpow(fastpow(sigma[i] * fastpow(A_0, p - 2, p), 1, p), fastpow(i, q - 2, q), p);
  console.log("A_1: ", A_1);
  for (let j = 0; j < n; j++) {
    if (j != i) {
      sigma[j] = fastpow(A_0 * fastpow(A_1, j, p), 1, p);
    }
    console.log("sigma[", j, "] sign: ", sigma[j]);
  }
  console.log("sigma sign: ", sigma);

  w_i = Math.floor(Math.random() * (q - 1));
  //console.log("w_i: ", w_i);
  var a = new Array(n).fill(null);
  var b = new Array(n).fill(null);
  a[i] = fastpow(g, w_i, p);
  b[i] = fastpow(hashed, w_i, p);

  var c = new Array(n).fill(null);
  var z = new Array(n).fill(null);
  for (var j = 0; j < n; j++) {
    if(j != i) {
        z[j] = Math.floor(Math.random() * (q - 1));
        c[j] = Math.floor(Math.random() * (q - 1));
        a[j] = fastpow(fastpow(g, z[j], p) * fastpow(userArray[j].y, c[j], p), 1,  p)
        b[j] = fastpow(fastpow(hashed, z[j], p) * fastpow(sigma[j], c[j], p), 1, p)
    }
  }
  c_solo = HashPrimePrime(issue, message, publicKeys, g, p, q, A_0, A_1, a, b)
  
  var sum = 0;
  for (let j = 0; j < n; j++) {
    if(j != i){
      sum = sum + c[j];
      //console.log("sum: ", sum); 
    }
  }
  //console.log("sum: ", sum); 
  sum = Math.pow(sum, 1) % q;
  //console.log("sum fast: ", sum);
  //console.log("c_solo: ", c_solo);
  /* if (c_solo - sum < 0) {
    c[i] = (Math.pow(c_solo - sum, 1) + q) % q;
  } else {
    c[i] = Math.pow(c_solo - sum, 1) % q;
  } */
  c[i] = Math.pow(c_solo - sum, 1) % q;
  if (c[i] < 0)
    c[i] += q;

  //console.log("c[i]: ", c[i]);
  //console.log("w_i: ", w_i);
  //console.log("c[i]*user.x: ", c[i]*user.x);
  //console.log("w_i - c[i]*user.x: ", w_i - c[i]*user.x);

  z[i] = Math.pow((w_i - c[i]*user.x), 1) % q;
  if (z[i] < 0)
    z[i] += q;
  //console.log("z[i]: ", z[i]);

  return [A_1, c, z]
}

function Verify(issue, publicKeys, message, signature, G, g, userArray) {
  var A_1 = signature[0];
  var c = signature[1];
  var z = signature[2];
  var n = publicKeys.length;
  //console.log("G: ", G);
  console.log("A_1: ", A_1);
  console.log("G.includes(g): ", G.includes(g))
  if (G.includes(g) == false)
    return false
  console.log("G.includes(A_1): ", G.includes(A_1))
  if(G.includes(A_1) == false)
    return false

  Zq = [...Array(q).keys()];
  //console.log("Zq: ", Zq)
  for (var i = 0; i < n; i++) {
    console.log("Zq.includes(c[i]): ", Zq.includes(c[i]));
    console.log("c[i]: ", c[i]);
    if(Zq.includes(c[i]) == false)
      return false
    console.log("Zq.includes(z[i]): ", Zq.includes(z[i]));
    console.log("z[i]: ", z[i]);
    if(Zq.includes(z[i]) == false)
      return false
    //console.log("G: ", G);
    //console.log("TYPEOF userArray[i].y: ", typeof userArray[i].y)
    console.log("G.includes(userArray[i].y): ", G.includes(userArray[i].y));
    console.log("userArray[i].y: ", userArray[i].y);
    if(G.includes(userArray[i].y) == false)
      return false
  }
  var hashed = Hash(issue, publicKeys, g, p, q);
  console.log("hashed: ", hashed)
  var A_0 = HashPrime(issue, publicKeys, g, p, q, message);

  var sigma = new Array(n).fill(null);
  for (var i = 0; i < n; i++) {
    sigma[i] = fastpow(A_0 * fastpow(A_1, i, p), 1, p);
  }
  console.log("sigma: ", sigma);

  var a = new Array(n).fill(null);
  var b = new Array(n).fill(null);
  for (var i = 0; i < n; i++) {
    a[i] = fastpow(fastpow(g, z[i], p) * fastpow(userArray[i].y, c[i], p), 1, p)
    b[i] = fastpow(fastpow(hashed, z[i], p) * fastpow(sigma[i], c[i], p), 1, p)
  }
  console.log("a: ", a);
  console.log("b: ", b);

  var sum = 0;
  for (var i = 0; i < n; i++) {
      sum = sum + c[i];
  }

  var Hpp = HashPrimePrime(issue,message, publicKeys, g, p, q, A_0, A_1, a, b);
  console.log("n: ", n);
  console.log("Hpp: ", Hpp);
  console.log("sum: ", sum);
  console.log("fastpow(Hpp, 1, q): ", fastpow(Hpp, 1, q));
  console.log("fastpow(sum, 1, q): ", fastpow(sum, 1, q));
  console.log("fastpow(Hpp, 1, q) != fastpow(sum, 1, q): ", fastpow(Hpp, 1, q) != fastpow(sum, 1, q));
  if(fastpow(Hpp, 1, q) != fastpow(sum, 1, q))
    return false
    
  return true
}

function Trace(issue, publicKeys, g, G, message, signature, messageb, signatureb) {
  ////console.log("signature: ", signature);
  var A_1 = signature[0];
  //console.log("A_1: ", A_1);
  //var c = signature[1];
  //var z = signature[2];
  //console.log("signatureb: ", signatureb);
  var A_1b = signatureb[0];
  //console.log("A_1b: ", A_1b);
  //var cb = signatureb[1];
  //var zb = signatureb[2];
  var n = publicKeys.length;

  //var hashed = Hash(issue, publicKeys, g, p, q);
  var A_0 = HashPrime(issue, publicKeys, g, p, q, message);
  var A_0b = HashPrime(issue, publicKeys, g, p, q, messageb);

  var sigma = new Array(n).fill(null);
  var sigmab = new Array(n).fill(null);

  for (var i = 0; i < n; i++) {
    sigma[i] = Math.pow(A_0 * Math.pow(A_1, i) % p, 1) % p;
    sigmab[i] = Math.pow(A_0b * Math.pow(A_1b, i) % p, 1) % p;
  } 

  var TList = [];
  //console.log("sigma: ", sigma);
    //console.log("sigmab: ", sigmab);
  for (var i = 0; i < n; i++) {
    //console.log("sigma[i]: ", sigma[i]);
    //console.log("sigmab[i]: ", sigmab[i]);
    if(sigma[i] == sigmab[i]){
      TList.push(publicKeys[i]);
      //console.log("TList[i]: ", TList);
    }
          
  }
  //console.log("TList: ", TList);
  if(TList.length == 1)
    //return "TList[0]", TList[0]
    return "this is the different message by the same person"
  else if(TList.length == n)
    return "linked"
  else
    return "indep"
}

var ring, userArray;
[G, g] = buildG();
function main() {
  var message = "voted";
  var message2 = "toast";
  var message3 = "voted";
  var message4 = "bidon";
  var issue = "2";
  var userNumber = 3;
  var id = 1;
  var id2 = 2;
  [G, g] = buildG();
  //console.log("G: ", G);
  //console.log("g: ", g);
  [ring, userArray] = myCreateRing(userNumber, g, G, q);
  //console.log("ring: ", ring);
  console.log("userArray: ", userArray);
  
  var signature = Sign(message, issue, ring.pKeys, userArray[id], G, g, userArray);
  //console.log("typeof signature: ", typeof signature);
  var signature2 = Sign(message2, issue, ring.pKeys, userArray[id2], G, g, userArray);
  var signature3 = Sign(message3, issue, ring.pKeys, userArray[id], G, g, userArray);
  var signature4 = Sign(message4, issue, ring.pKeys, userArray[id], G, g, userArray);

  //#TESTS

    console.log("Verif of message and his signature : ")
    console.log(Verify(issue, ring.pKeys, message, signature, G, g, userArray))

    console.log("\nVerif of message2 and another signature : ")
    console.log(Verify(issue, ring.pKeys, message2, signature, G, g, userArray))

    console.log("\nVerif of message2 and his signature : ")
    console.log(Verify(issue, ring.pKeys, message2, signature2, G, g, userArray))

    console.log("\nTrace of different message by different people :")
    console.log(Trace(issue, ring.pKeys, g, G, message, signature, message2, signature2))

    console.log("\nTrace of same message by the same person :")
    console.log(Trace(issue, ring.pKeys, g, G, message, signature, message3, signature3))

    console.log("\nTrace of different message by the same person :")
    console.log(Trace(issue, ring.pKeys, g, G, message, signature, message4, signature4))
}
main();

module.exports = {main, buildG, myCreateRing, Sign, Verify, G, g, q};
