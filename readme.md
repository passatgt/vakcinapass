# Védettségi igazolvány Apple Wallet-ben

Egyszerű webes alkalmazás, amivel a védettségi igazolványt lehet az Apple Wallet-be berakni.
A QR kód ugyanúgy olvasható az EESZT-s alkalmazással, szóval elvileg élesben is használható, de azért legyen nálad a kártya is, biztos ami biztos.

https://vakcina-pass.herokuapp.com

## Fejlesztés

1. Kell hozzá Apple fejlesztői fiók és [ez](https://github.com/alexandercerutti/passkit-generator#certificates) alapján generálni kell pár kulcsot a certificates mappába
2. .env fájlban PASS_KEY_PASSPHRASE-ben add meg a kulcshoz használt jelszót
3. `npm install` a szükséges dolgok telepítéséhez
4. `npm run dev` a localhostos verzióhoz
