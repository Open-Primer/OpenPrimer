You are a professional academic translator. The Translation Critic Agent has rejected your previous translation with the following critique:

CRITIQUE FROM TRANSLATION CRITIC:
The translation has an inconsistency in formality. The sentence "Utiliza el cuestionario interactivo..." uses the informal 'tú' form, while the rest of the document consistently uses the formal 'usted' form (e.g., "lea", "asegúrese", "redacte", "analice", "evalúe", "reflexione"). For consistency, "Utiliza" should be changed to "Utilice".

Original MDX Content to Translate:
---
title: "5. Final Summative Evaluation"
subject: "Computer_Science"
level: "L1"
module: "Summative Terminal Exam"
order: 5
summative: true
---

__JSX_SELF_Prerequisites_6__

# 5. Final Summative Evaluation

Welcome to the Final Summative Evaluation for the **Introduction to Cryptography** course. This exam is designed to test your understanding of classical ciphers, symmetric encryption, entropy, key exchange, and the mathematical foundations of the RSA cryptosystem.

This evaluation consists of a series of theoretical questions, mathematical calculation exercises, and critical thinking assessments. Please read each question carefully and ensure your answers are precise and mathematically rigorous.

---

## Part 1: Comprehensive Theoretical Assessment

Use the interactive quiz below to test your knowledge of both symmetric and asymmetric paradigms.

__JSX_OPEN_Quiz_7__
  __JSX_ATTR_Question_8__ What is the core distinction between information-theoretic security (perfect secrecy) and complexity-theoretic security? ||| Information-theoretic security (like the One-Time Pad) means that the cipher cannot be broken even with infinite computational power because the ciphertext contains no information. Complexity-theoretic security (like AES or RSA) means that breaking the cipher is computationally infeasible for a bounded-time adversary under standard mathematical assumptions. __JSX_END_8__
  __JSX_ATTR_Option_9__ Information-theoretic security relies on the secrecy of the algorithm, while complexity-theoretic security relies on Kerckhoffs's Principle. __JSX_END_9__
  __JSX_ATTR_Option_10__ Information-theoretic security cannot be broken even with infinite computational power, whereas complexity-theoretic security assumes bounded adversary computing power. __JSX_END_10__
  __JSX_ATTR_Option_11__ Information-theoretic security requires asymmetric keypairs, while complexity-theoretic security requires symmetric keys. __JSX_END_11__
  __JSX_ATTR_Option_12__ Information-theoretic security is only applicable to classical ciphers like the Caesar cipher. __JSX_END_12__
__JSX_CLOSE_Question_0__

  __JSX_ATTR_Question_13__ In the Advanced Encryption Standard (AES), which transformation represents the sole source of non-linear confusion? ||| SubBytes is the only non-linear transformation in AES, utilizing an S-Box to translate bytes. ShiftRows and MixColumns are linear operations providing diffusion, and AddRoundKey is a simple linear XOR. __JSX_END_13__
  __JSX_ATTR_Option_14__ SubBytes __JSX_END_14__
  __JSX_ATTR_Option_15__ ShiftRows __JSX_END_15__
  __JSX_ATTR_Option_16__ MixColumns __JSX_END_16__
  __JSX_ATTR_Option_17__ AddRoundKey __JSX_END_17__
__JSX_CLOSE_Question_1__

  __JSX_ATTR_Question_18__ What is the Discrete Logarithm Problem (DLP) mathematically? ||| The DLP is the problem of finding the integer 'a' given A, g, and p such that g^a = A mod p, where p is prime and g is a generator. __JSX_END_18__
  __JSX_ATTR_Option_19__ Finding the prime factors p and q of a massive composite number n. __JSX_END_19__
  __JSX_ATTR_Option_20__ Finding the exponent 'a' given A, g, and p such that g^a = A mod p. __JSX_END_20__
  __JSX_ATTR_Option_21__ Finding the modular multiplicative inverse of e modulo phi(n). __JSX_END_21__
  __JSX_ATTR_Option_22__ Computing the greatest common divisor of two extremely large integers. __JSX_END_22__
__JSX_CLOSE_Question_2__

  __JSX_ATTR_Question_23__ Why is the Electronic Codebook (ECB) mode of a block cipher considered highly insecure for complex data? ||| ECB mode encrypts identical plaintext blocks into identical ciphertext blocks, preserving visual or statistical patterns of the original data. __JSX_END_23__
  __JSX_ATTR_Option_24__ It requires a shared key that is twice as long as the block size. __JSX_END_24__
  __JSX_ATTR_Option_25__ It does not utilize any key, relying entirely on the obscurity of the substitution table. __JSX_END_25__
  __JSX_ATTR_Option_26__ It encrypts identical plaintext blocks into identical ciphertext blocks, preserving visual or statistical patterns. __JSX_END_26__
  __JSX_ATTR_Option_27__ It can only be used to encrypt text messages of exactly 128 characters. __JSX_END_27__
__JSX_CLOSE_Question_3__
__JSX_CLOSE_Quiz_4__

---

## Part 2: Essay-Style Academic Review

Please draft a detailed response to the following theoretical question. Your response will be parsed and evaluated by our academic AI tutor.

__JSX_ATTR_EssayEvaluation_28__ Critically analyze how the 'Key Distribution Problem' in symmetric cryptography led to the creation of Asymmetric Key Exchanges like Diffie-Hellman. In your essay, detail: (1) why symmetric cryptography is logistically challenging for massive global networks, (2) how Diffie-Hellman bypasses this problem mathematically using cyclic groups, and (3) the exact threat model (e.g., active vs. passive adversaries) that Diffie-Hellman addresses. ||| Asymmetric Cryptography Foundations __JSX_END_28__

---

## Part 3: Advanced Mathematical Logic

Evaluate your understanding of the modular arithmetic relationships underlying asymmetric ciphers.

__JSX_SELF_CardSort_29__

---

## Part 4: Socratic Self-Reflection

To conclude your terminal evaluation, reflect on the practical threat landscapes of the mathematical systems you have studied.

__JSX_SELF_SocraticInput_30__

---

__JSX_ATTR_Summary_31__  __JSX_END_31__

__JSX_OPEN_References_32__
  * **Koblitz, N.** (1994). *A Course in Number Theory and Cryptography*. Springer-Verlag.
  * **Paar, C., & Pelzl, J.** (2009). *Understanding Cryptography: A Textbook for Students and Practitioners*. Springer.
__JSX_CLOSE_References_5__


Previous Rejected Translation:
---
title: "5. Evaluación Sumativa Final"
subject: "Ciencias_de_la_Computación"
level: "L1"
module: "Examen Terminal Sumativo"
order: 5
summative: true
---

__JSX_SELF_Prerequisites_6__

# 5. Evaluación Sumativa Final

Bienvenido/a a la Evaluación Sumativa Final del curso de **Introducción a la Criptografía**. Este examen está diseñado para evaluar su comprensión de los cifrados clásicos, la encriptación simétrica, la entropía, el intercambio de claves y los fundamentos matemáticos del criptosistema RSA.

Esta evaluación consta de una serie de preguntas teóricas, ejercicios de cálculo matemático y evaluaciones de pensamiento crítico. Por favor, lea cada pregunta cuidadosamente y asegúrese de que sus respuestas sean precisas y matemáticamente rigurosas.

---
## Parte 1: Evaluación Teórica Integral

Utiliza el cuestionario interactivo a continuación para poner a prueba tus conocimientos sobre los paradigmas simétricos y asimétricos.

__JSX_OPEN_Quiz_7__
  __JSX_ATTR_Question_8__ ¿Cuál es la distinción fundamental entre la seguridad teórica de la información (secreto perfecto) y la seguridad teórica de la complejidad? ||| La seguridad teórica de la información (como el One-Time Pad) significa que el cifrado no puede romperse incluso con una potencia computacional infinita porque el texto cifrado no contiene información. La seguridad teórica de la complejidad (como AES o RSA) significa que romper el cifrado es computacionalmente inviable para un adversario con tiempo limitado bajo suposiciones matemáticas estándar. __JSX_END_8__
  __JSX_ATTR_Option_9__ La seguridad teórica de la información se basa en el secreto del algoritmo, mientras que la seguridad teórica de la complejidad se basa en el Principio de Kerckhoffs. __JSX_END_9__
  __JSX_ATTR_Option_10__ La seguridad teórica de la información no puede romperse incluso con una potencia computacional infinita, mientras que la seguridad teórica de la complejidad asume una potencia computacional limitada del adversario. __JSX_END_10__
  __JSX_ATTR_Option_11__ La seguridad teórica de la información requiere pares de claves asimétricas, mientras que la seguridad teórica de la complejidad requiere claves simétricas. __JSX_END_11__
  __JSX_ATTR_Option_12__ La seguridad teórica de la información solo es aplicable a cifrados clásicos como el cifrado César. __JSX_END_12__
__JSX_CLOSE_Question_0__

  __JSX_ATTR_Question_13__ En el Estándar de Cifrado Avanzado (AES), ¿qué transformación representa la única fuente de confusión no lineal? ||| SubBytes es la única transformación no lineal en AES, utilizando una S-Box para traducir bytes. ShiftRows y MixColumns son operaciones lineales que proporcionan difusión, y AddRoundKey es un XOR lineal simple. __JSX_END_13__
  __JSX_ATTR_Option_14__ SubBytes __JSX_END_14__
  __JSX_ATTR_Option_15__ ShiftRows __JSX_END_15__
  __JSX_ATTR_Option_16__ MixColumns __JSX_END_16__
  __JSX_ATTR_Option_17__ AddRoundKey __JSX_END_17__
__JSX_CLOSE_Question_1__

  __JSX_ATTR_Question_18__ ¿Qué es el Problema del Logaritmo Discreto (DLP) matemáticamente? ||| El DLP es el problema de encontrar el entero 'a' dados A, g y p tal que g^a = A mod p, donde p es primo y g es un generador. __JSX_END_18__
  __JSX_ATTR_Option_19__ Encontrar los factores primos p y q de un número compuesto masivo n. __JSX_END_19__
  __JSX_ATTR_Option_20__ Encontrar el exponente 'a' dados A, g y p tal que g^a = A mod p. __JSX_END_20__
  __JSX_ATTR_Option_21__ Encontrar el inverso multiplicativo modular de e módulo phi(n). __JSX_END_21__
  __JSX_ATTR_Option_22__ Calcular el máximo común divisor de dos enteros extremadamente grandes. __JSX_END_22__
__JSX_CLOSE_Question_2__

  __JSX_ATTR_Question_23__ ¿Por qué el modo Electronic Codebook (ECB) de un cifrado por bloques se considera altamente inseguro para datos complejos? ||| El modo ECB cifra bloques de texto plano idénticos en bloques de texto cifrado idénticos, preservando patrones visuales o estadísticos de los datos originales. __JSX_END_23__
  __JSX_ATTR_Option_24__ Requiere una clave compartida que es el doble de larga que el tamaño del bloque. __JSX_END_24__
  __JSX_ATTR_Option_25__ No utiliza ninguna clave, basándose completamente en la oscuridad de la tabla de sustitución. __JSX_END_25__
  __JSX_ATTR_Option_26__ Cifra bloques de texto plano idénticos en bloques de texto cifrado idénticos, preservando patrones visuales o estadísticos. __JSX_END_26__
  __JSX_ATTR_Option_27__ Solo puede usarse para cifrar mensajes de texto de exactamente 128 caracteres. __JSX_END_27__
__JSX_CLOSE_Question_3__
__JSX_CLOSE_Quiz_4__

---
## Parte 2: Revisión Académica en Formato de Ensayo

Por favor, redacte una respuesta detallada a la siguiente pregunta teórica. Su respuesta será analizada y evaluada por nuestro tutor académico de IA.

__JSX_ATTR_EssayEvaluation_28__ Analice críticamente cómo el 'Problema de Distribución de Claves' en la criptografía simétrica condujo a la creación de Intercambios de Claves Asimétricas como Diffie-Hellman. En su ensayo, detalle: (1) por qué la criptografía simétrica es logísticamente desafiante para redes globales masivas, (2) cómo Diffie-Hellman elude este problema matemáticamente utilizando grupos cíclicos, y (3) el modelo de amenaza exacto (p. ej., adversarios activos vs. pasivos) que aborda Diffie-Hellman. ||| Fundamentos de Criptografía Asimétrica __JSX_END_28__

---
## Parte 3: Lógica Matemática Avanzada

Evalúe su comprensión de las relaciones de aritmética modular que subyacen a los cifrados asimétricos.

__JSX_SELF_CardSort_29__

---
## Parte 4: Autorreflexión Socrática

Para concluir su evaluación final, reflexione sobre los panoramas de amenazas prácticas de los sistemas matemáticos que ha estudiado.

__JSX_SELF_SocraticInput_30__

---

__JSX_ATTR_Summary_31__  __JSX_END_31__

__JSX_OPEN_References_32__
  * **Koblitz, N.** (1994). *A Course in Number Theory and Cryptography*. Springer-Verlag.
  * **Paar, C., & Pelzl, J.** (2009). *Understanding Cryptography: A Textbook for Students and Practitioners*. Springer.
__JSX_CLOSE_References_5__

Please re-translate the Original MDX Content to "ES", correcting all issues highlighted by the critic.
Follow all initial translation rules:
1. Preserve all markdown structure, custom blockquotes, headings, lists, and links.
2. Keep all Math equations (wrapped in $ or $) completely untouched.
3. Do NOT translate technical code blocks or placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__, and source attribution placeholders like __SRC_ATTR_PLACEHOLDER_...__. Preserve them EXACTLY as they are. Do not translate the '|||' separators. Absolutely do NOT append any text, properties, or attributes to these placeholders (for example, never append itemsBase64=... next to __JSX_SELF_References_...__).
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.
5. CRITICAL ACADEMIC INTEGRITY & CITATION RULES:
   - Do NOT translate any bibliographic references, book/article/publication titles, author names, publishers, publication cities, or citation texts. These must remain exactly in their original language to preserve academic citation integrity.
   - Do NOT translate the "Source:" prefix or any associated bibliographic links/attributions in figures, captions, or text.
   - In quote blocks (lines starting with '>'), do NOT translate the author name or the publication details following the '—' dash.
   - Translate the quote content into the target course language, followed by its original version in brackets (e.g., `[Original: "Original quote..."]`) IF the target course language is different from the quote's original language. If the target course language is the same as the quote's original language, only keep the original version (do NOT repeat it or wrap it in brackets). Never translate the original citation text in the brackets.