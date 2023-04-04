''' import miscellaneous
import timeit
import Ring '''
from random import randint
from math import gcd
import hashlib
from random import randint

class myRing:
    def __init__(self, pKeys):
        self.pKeys = pKeys
        self.n = len(pKeys)

class myUser:
    def __init__(self, id, g, G, q):
        self.x = randint(0, q-1)
        self.y = pow(g, self.x, 2*q+1)
        self.Pkeys = {'g':g , 'y':self.y, 'G':G}
        self.Skeys = {'Pkey':self.Pkeys, 'x':self.x}
        self.id =id
    def __repr__(self):
        return f"x: {self.x}\ny: {self.y}\nPkeys: {self.Pkeys}\nSkeys: {self.Skeys}\nid: {self.id}\n"

def myCreateRing(n, g, G, q):
    pKeys =[None]*n
    userArray =[None]*n
    for i in range(n):
        user = myUser(i, g, G, q)
        pKeys[i]= user.Pkeys
        userArray[i] = user
    ring = myRing(pKeys)
    #print("userArray: ",  userArray)
    return ring, userArray
  
def Hash(issue, publicKeys, g, p, q):
    s = issue
    ''' for keys in publicKeys:
        print("keys: ", keys)
        s.join(keys)
        #print("s.join:", s)
    #print("type s: ", type(s)) '''
    #print("s: ", s)
    ''' testbin = ''.join(x for x in s)
    print("testbin: ", testbin) '''
    ''' for x in s:
        print("x: ", x)
        print("ord(x): ", ord(x))
        print("format(ord(x), 'b'): ", format(ord(x), 'b')) '''
    binary = ''.join(format(ord(x), 'b') for x in s)
    ''' print("binary: ", binary)
    print("binary.encode(): ", binary.encode())
    print("hashlib.sha1(binary.encode()): ", hashlib.sha1(binary.encode())) '''
    hashed = int(hashlib.sha1(binary.encode()).hexdigest(), 16)
    ''' print("hashed: ", hashed)
    print("pow(hashed, 1, q): ", pow(hashed, 1, q)) '''
    hashed = pow(g, pow(hashed, 1, q), p)
    #print("hashed pow: ", hashed)
    return hashed

def HashPrime(issue, publicKeys, g, p, q, m):
    s = issue
    for keys in publicKeys:
        s.join(keys)
    s = s+m
    print("s: ", s)
    binary = ''.join(format(ord(x), 'b') for x in s)
    print("binary: ", binary)
    hashed = int(hashlib.sha1(binary.encode()).hexdigest(), 16)
    hashed = pow(g, pow(hashed, 1, q), p)
    print("hashed prime pow: ", hashed)
    return hashed

def HashPrimePrime(issue, message,  publicKeys, g, p, q, A_0, A_1, a, b):
    s = issue
    for keys in publicKeys:
        s.join(keys)
    s = s + str(A_0)
    s = s + str(A_1)
    s = s + message
    #print("s: ", s)
    #print("a + b: ", a + b)
    for n in a + b:
        s = s + str(n)
    #print("s+n: ", s)
    binary = ''.join(format(ord(x), 'b') for x in s)
    hashed = int(hashlib.sha1(binary.encode()).hexdigest(), 16)
    hashed = pow(hashed, 1, q)
    #print("hashed pow: ", hashed)
    return hashed

def findCoprimeList(n):
    coprimeList = []
    for i in range(2, n):
        if(gcd(i, n) == 1):
            coprimeList.append(i)
    return coprimeList
  
q = 89      #must be Sophie Germain prime number
p = 2*q+1   #prime too

def buildG():
    #start = timeit.default_timer()
    primfac = [2, q] #décomposition en facteurs premiers de p-1 = 2*q
    #print("primfac: ", primfac)
    generatorFound = False
    x = 1
    #print("not generatorFound: ", not generatorFound)
    while not generatorFound :  #while pour chercher le premier generateur x
        generatorFound = True
        x = x+1
        
        for pi in primfac:
            ''' print("pi: ", pi)
            
            print("pow(x,int((p-1)/pi))): ", pow(x,int((p-1)/pi)));
            print("pow(x,int((p-1)/pi), p): ", pow(x,int((p-1)/pi), p)); '''
            if (pow(x,int((p-1)/pi), p) == 1) :
                generatorFound = False

    generators = [x]
    #print("generators x : ", generators)
    #print("p-1: ", p-1)
    coprimeList = findCoprimeList(p-1)
    #print("coprimeList: ", coprimeList)
    for qi in coprimeList:
        generators.append(pow(x, qi, p))
    #print("generators: ", generators)
    generators = sorted(generators)
    #print("generators sorted: ", generators)
    G = []
    g = generators[1]
    g = pow(g*g, 1, p)
    #print("g = pow(g*g, 1, p): ", g)
    for qi in range(0, q):
        #print("pow(", g,", ", qi, ", ", "p): ", pow(g, qi, p))
        G.append(pow(g, qi, p))
    G = sorted(G)

    return G, g

def Sign(message, issue, publicKeys, user, G, g, userArray):

    n = len(publicKeys)
    i = user.id

    ####  etape 1  ####

    sigma = [None] * n
    hashed = Hash(issue, publicKeys, g, p, q)
    sigma[i] = pow(hashed, user.x, p)

    ####  etape 2  ####

    A_0 = HashPrime(issue, publicKeys, g, p, q, message)
    #print("A_0: ", A_0)
    A_1 = pow(pow(sigma[i] * pow(A_0, p-2 , p), 1, p), pow(i, q-2 , q), p)
    #print("A_1: ", A_1)
    ####  etape 3  ####

    for j in range(0, n):
        if(j != i):
            sigma[j] = pow(A_0 * pow(A_1, j, p), 1, p)

    #### etape 4  ####
    ## a ##
    w_i = randint(0, q-1)
    a, b = [None] * n, [None] * n
    a[i] = pow(g, w_i, p)
    b[i] = pow(hashed, w_i, p)
    ## b ##
    z, c = [None]*n, [None]*n
    for j in range(0, n):
        if(j != i):
            z[j] = randint(0, q-1)
            c[j] = randint(0, q-1)
            a[j] = pow(pow(g, z[j], p) * pow(userArray[j].y, c[j], p), 1,  p)
            b[j] = pow(pow(hashed, z[j], p) * pow(sigma[j], c[j], p), 1, p)
    ## c ##
    c_solo = HashPrimePrime(issue, message, publicKeys, g, p, q, A_0, A_1, a, b)
    ## d ##
    sum = 0
    for j in range(0, n):
        if(j != i):
            sum = sum + c[j]
    #print("sum: ", sum)
    sum = pow(sum, 1, q)
    print("sum pow: ", sum);
    print("c_solo: ", c_solo);
    c[i] = pow(c_solo - sum, 1, q)
    print("c[i]: ", c[i]);
    print("c: ", c);
    z[i] = pow(w_i - c[i]*user.x, 1, q)

    return [A_1, c, z]

def Verify(issue, publicKeys, message, signature, G, g, userArray):
    A_1, c, z = signature
    n = len(publicKeys)
    ## etape 1 ##
    if(g not in G):
        return False
    print("G: ", G)
    print("A_1: ", A_1)
    print("A_1 not in G: ", A_1 not in G)
    if(A_1 not in G):
        return False
    #pour tout nombre entier x, si x^q%p == 1 alors x appartient à G  !!
    Zq = list(range(0, q))
    print("Zq: ", Zq)
    for i in range(0, n):
        print("c[i]: ", c[i])
        if(c[i] not in Zq):
            return False
        print("z[i]: ", z[i])
        if(z[i] not in Zq):
            return False
        print("userArray[i].y: ", userArray[i].y)
        if(userArray[i].y not in G):
            return False
    hashed = Hash(issue, publicKeys, g, p, q)

    A_0 = HashPrime(issue, publicKeys, g, p, q, message)
    sigma = [None]*n
    for i in range(0, n):
        sigma[i] = pow(A_0*pow(A_1, i, p), 1, p)
    ## etape 2 ##
    a, b = [None]*n, [None]*n
    for i in range(0, n):
        a[i] = pow(pow(g, z[i], p) * pow(userArray[i].y, c[i], p), 1, p)
        b[i] = pow(pow(hashed, z[i], p) * pow(sigma[i], c[i], p), 1, p)
    ## etape 3 ##
    sum = 0
    for i in range(0, n):
        sum = sum + c[i]
    Hpp = HashPrimePrime(issue,message, publicKeys, g, p, q, A_0, A_1, a, b)

    if(pow(Hpp, 1, q) != pow(sum, 1, q)):
        return False

    ## etape 4 ##
    return True

def Trace(issue, publicKeys, g, G, message, signature, messageb, signatureb):
    print("signature: ", signature);
    A_1, c, z = signature
    print("A_1: ", A_1)
    print("signatureb: ", signatureb);
    A_1b, cb, zb = signatureb
    print("A_1b: ", A_1b)
    n = len(publicKeys)

    ## etape 1 ##
    hashed = Hash(issue, publicKeys, g, p, q)
    A_0 = HashPrime(issue, publicKeys, g, p, q, message)
    A_0b = HashPrime(issue, publicKeys, g, p, q, messageb)

    sigma = [None] * n
    sigmab = [None] * n
    for i in range(0, n):
        sigma[i] = pow(A_0 * pow(A_1, i, p), 1, p)
        sigmab[i] = pow(A_0b * pow(A_1b, i, p), 1, p)

    ## etape 2 ##

    TList = []
    print("sigma:", sigma)
    print("sigmab:", sigmab)
    for i in range(0, n):
        print("sigma[i]:", sigma[i])
        print("sigmab[i]:", sigmab[i])
        if(sigma[i] == sigmab[i]):
            TList.append(publicKeys[i])

    ## etape 3 ##
    print("TList: ", TList)
    if(len(TList) == 1):
        print("this is the different message by the same person")
        return "TList[0]", TList[0]
        
    elif(len(TList) == n):
        return "linked"
    else:
        return "indep"


def main():
    message = "salut"
    message2 = "toast"
    message3 = "salut"
    message4 = "bidon"
    issue = "2"
    userNumber = 3
    id = 1
    id2 = 2
    G, g = buildG()
    #print("G:", G)
    #print("g:", g)
    ring, userArray = myCreateRing(userNumber, g, G, q)
    #print("ring: ", ring.__dict__)
    print("userArray: ", userArray)
    signature = Sign(message, issue, ring.pKeys, userArray[id], G, g, userArray)
    print("signature: ", signature)
    print("signature: ", type(signature))
    signature2 = Sign(message2, issue, ring.pKeys, userArray[id2], G, g, userArray)
    signature3 = Sign(message3, issue, ring.pKeys, userArray[id], G, g, userArray)
    signature4 = Sign(message4, issue, ring.pKeys, userArray[id], G, g, userArray)

    #TESTS

    print("Verif of message and his signature : ")
    print(Verify(issue, ring.pKeys, message, signature, G, g, userArray))
    
    print("\nVerif of message2 and another signature : ")
    print(Verify(issue, ring.pKeys, message2, signature, G, g, userArray))

    print("\nVerif of message2 and his signature : ")
    print(Verify(issue, ring.pKeys, message2, signature2, G, g, userArray))

    print("\nTrace of different message by different people :")
    print(Trace(issue, ring.pKeys, g, G, message, signature, message2, signature2))

    print("\nTrace of same message by the same person :")
    print(Trace(issue, ring.pKeys, g, G, message, signature, message3, signature3))

    print("\nTrace of different message by the same person :")
    print(Trace(issue, ring.pKeys, g, G, message, signature, message4, signature4))
    
    ''' for i in userArray:
        print("userArray: ", userArray)
        print("userArray.x: ", i.x)
        print("userArray.y: ", i.y)
        print("userArray.Pkeys: ", i.Pkeys)
        print("userArray.Skeys: ", i.Skeys)
        print("userArray.id: ", i.id) '''
        
main()