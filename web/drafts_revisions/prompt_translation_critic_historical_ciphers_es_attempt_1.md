You are the Translation Critic Agent (Agent 4 - Specialized in Translation Quality Assurance). Your job is to strictly validate the translated academic MDX content against the original source content.
Source Language: English
Target Language: "ES"

Original MDX Content (JSX components shown as placeholders for fair comparison):
---
title: "1. Historical Ciphers & Foundations"
subject: "Computer_Science"
level: "L1"
module: "Symmetric Encryption & Foundations"
order: 1
---

__JSX_SELF_Prerequisites_8__

# 1. Historical Ciphers & Foundations

Cryptography, the science of secure communication, is a cornerstone of modern information security. Its primary objective is to allow two parties—traditionally called Alice and Bob—to communicate over an insecure channel in such a way that an adversary, Eve, cannot understand the content of their messages.

In this lesson, we will explore the mathematical foundations of classical cryptography. We will analyze the historical ciphers that laid the groundwork for modern encryption, and understand why they are insecure against mathematical cryptanalysis.

__JSX_OPEN_Objectives_9__
  __JSX_OPEN_Knowledge_10__
    * Define the terms Plaintext, Ciphertext, Key, Encryption, Decryption, and Keyspace.
    * Understand the mathematical definition of modular arithmetic.
    * Explain the mechanism of monoalphabetic and polyalphabetic substitution.
  __JSX_CLOSE_Knowledge_0__
  __JSX_OPEN_Skills_11__
    * Mathematically encode and decode messages using the Caesar and Vigenère ciphers.
    * Perform frequency analysis cryptanalysis on simple substitution ciphers.
    * Calculate the size of the keyspace for different classical ciphers.
  __JSX_CLOSE_Skills_1__
  __JSX_OPEN_Attitudes_12__
    * Develop a critical mindset regarding the security of ad-hoc encryption schemes.
    * Appreciate the transition from obscurity-based security to rigorous mathematical proofs.
  __JSX_CLOSE_Attitudes_2__
__JSX_CLOSE_Objectives_3__

---

## The Core Cryptographic Primitive

Every encryption scheme consists of a **plaintext space** \(\mathcal{M}\), a **ciphertext space** \(\mathcal{C}\), a **keyspace** \(\mathcal{K}\), and a pair of algorithms:
- An **Encryption Algorithm** \(E: \mathcal{M} \times \mathcal{K} \rightarrow \mathcal{C}\)
- A **Decryption Algorithm** \(D: \mathcal{C} \times \mathcal{K} \rightarrow \mathcal{M}\)

The fundamental correctness requirement of cryptography is that for any plaintext \(m \in \mathcal{M}\) and key \(k \in \mathcal{K}\):
\[D(E(m, k), k) = m\]

![Symmetric Cryptography Diagram](/images/cryptography/symmetric_encryption.png)

---

## The Caesar Cipher (Monoalphabetic Substitution)

The Caesar cipher is one of the earliest recorded encryption techniques, named after Julius Caesar, who used it to communicate with his generals.

### Mathematical Formulation
To represent the letters of the English alphabet mathematically, we map them to the set of integers modulo 26:
\[\mathbb{Z}_{26} = \{0, 1, 2, \dots, 25\}\]
where 'A' \(\mapsto 0\), 'B' \(\mapsto 1\), \dots, 'Z' \(\mapsto 25\).

Given a shift key \(k \in \mathbb{Z}_{26}\), the encryption of a single letter \(p \in \mathbb{Z}_{26}\) is:
\[E(p, k) = (p + k) \pmod{26}\]

And decryption of a ciphertext letter \(c \in \mathbb{Z}_{26}\) is:
\[D(c, k) = (c - k) \pmod{26}\]

__JSX_ATTR_DiagnosticQuiz_13__  |||  |||  __JSX_END_13__

### Interactive Demonstration
Below, you can experiment with Caesar cipher encryption and decryption directly in your browser.

__JSX_SELF_CodeSandbox_14__

---

## Why Caesar is Broken: Keyspace Complexity

The major weakness of the Caesar cipher lies in its tiny keyspace. Because the key \(k\) must be an integer between \(1\) and \(25\), there are only **25 possible keys** (a shift of 0 or 26 does not alter the plaintext).

An eavesdropper, Eve, can easily perform a **brute-force attack** by trying all 25 possible keys until she reads intelligible plaintext.

__JSX_OPEN_SolvedExercise_15__
  **Problem:**
  Calculate the size of the keyspace for a general monoalphabetic substitution cipher, where each letter of the alphabet is mapped to a unique permutation of the alphabet.

  **Solution:**
  In a general monoalphabetic substitution cipher, we can map 'A' to any of the 26 letters. 'B' can then be mapped to any of the remaining 25 letters, 'C' to any of the 24 letters, and so on.

  Therefore, the keyspace size is the number of permutations of 26 elements:
  \[|\mathcal{K}| = 26! \approx 4.03 \times 10^{26}\]

  This is a massive keyspace, larger than \(2^{88}\). A brute-force attack trying 1 billion keys per second would take over 12 billion years to complete!
__JSX_CLOSE_SolvedExercise_4__

---

## Frequency Analysis: Breaking General Substitution

Even though a general substitution cipher has a keyspace of \(26!\), it is still completely insecure. Why? Because it preserves the **statistical distribution** of the underlying language.

In any natural language, some letters occur much more frequently than others. In English, 'E' is the most frequent letter (approx. 12.7%), followed by 'T', 'A', and 'O'. By counting the occurrences of each letter in the ciphertext, we can map the most frequent ciphertext letters to the most frequent English letters, rapidly cracking the code.

__JSX_SELF_SocraticInput_16__

---

## The Vigenère Cipher (Polyalphabetic Substitution)

To counter frequency analysis, 16th-century cryptographers developed polyalphabetic substitution. The Vigenère cipher uses a repeating keyword to determine a series of different Caesar shifts.

### Mathematical Formulation
Let the key be a vector of shifts \(\vec{k} = (k_0, k_1, \dots, k_{d-1})\) of period \(d\).
For a plaintext message \(\vec{p} = (p_0, p_1, \dots)\), the ciphertext element \(c_i\) is:
\[c_i = (p_i + k_{i \pmod d}) \pmod{26}\]

By changing the shift from letter to letter, Vigenère flattens the frequency distribution, making simple frequency analysis impossible.

__JSX_OPEN_Quiz_17__
  __JSX_ATTR_Question_18__ What is the main technique used to find the key length 'd' of a Vigenère cipher? ||| Kasiski examination identifies repeating sequences of ciphertext to find common divisors of their distances, which represent candidates for key length. Friedman test uses the Index of Coincidence. __JSX_END_18__
  __JSX_ATTR_Option_19__ Brute-forcing all 26! permutations of the letters __JSX_END_19__
  __JSX_ATTR_Option_20__ Searching for the most frequent single letter in the ciphertext __JSX_END_20__
  __JSX_ATTR_Option_21__ Kasiski Examination or Friedman Test (Index of Coincidence) __JSX_END_21__
  __JSX_ATTR_Option_22__ Linear cryptanalysis using feedback shift registers __JSX_END_22__
__JSX_CLOSE_Question_5__
__JSX_CLOSE_Quiz_6__

---

## Card Sort: Cryptographic Terms Match

Match the classical cryptography terms with their descriptions.

__JSX_SELF_CardSort_23__

---

## Historical Timeline of Classical Cryptography

Explore the key moments in classical cryptographic history.

__JSX_SELF_Timeline_24__

---

__JSX_ATTR_Summary_25__  __JSX_END_25__

__JSX_SELF_WhatsNext_26__

__JSX_OPEN_References_27__
  * **Kahn, D.** (1996). *The Codebreakers: The Comprehensive History of Secret Communication from Ancient Times to the Internet*. Scribner.
  * **Shannon, C. E.** (1949). *Communication Theory of Secrecy Systems*. Bell System Technical Journal.
__JSX_CLOSE_References_7__


Translated MDX Content (JSX components shown as placeholders for fair comparison):
---
title: "1. Cifrados Históricos y Fundamentos"
subject: "Ciencias_de_la_Computación"
level: "L1"
module: "Cifrado Simétrico y Fundamentos"
order: 1
---

__JSX_SELF_Prerequisites_8__

# 1. Cifrados Históricos y Fundamentos

La criptografía, la ciencia de la comunicación segura, es una piedra angular de la seguridad de la información moderna. Su objetivo principal es permitir que dos partes —tradicionalmente llamadas Alice y Bob— se comuniquen a través de un canal inseguro de tal manera que un adversario, Eve, no pueda comprender el contenido de sus mensajes.

En esta lección, exploraremos los fundamentos matemáticos de la criptografía clásica. Analizaremos los cifrados históricos que sentaron las bases para el cifrado moderno y comprenderemos por qué son inseguros frente al criptoanálisis matemático.

__JSX_OPEN_Objectives_9__
  __JSX_OPEN_Knowledge_10__
    * Definir los términos Texto plano, Cifrado, Clave, Cifrado, Descifrado y Espacio de claves.
    * Comprender la definición matemática de la aritmética modular.
    * Explicar el mecanismo de sustitución monoalfabética y polialfabética.
  __JSX_CLOSE_Knowledge_0__
  __JSX_OPEN_Skills_11__
    * Codificar y decodificar matemáticamente mensajes utilizando los cifrados César y Vigenère.
    * Realizar criptoanálisis por análisis de frecuencia en cifrados de sustitución simple.
    * Calcular el tamaño del espacio de claves para diferentes cifrados clásicos.
  __JSX_CLOSE_Skills_1__
  __JSX_OPEN_Attitudes_12__
    * Desarrollar una mentalidad crítica con respecto a la seguridad de los esquemas de cifrado ad-hoc.
    * Apreciar la transición de la seguridad basada en la oscuridad a pruebas matemáticas rigurosas.
  __JSX_CLOSE_Attitudes_2__
__JSX_CLOSE_Objectives_3__

---
## El Primitivo Criptográfico Central

Todo esquema de cifrado consta de un **espacio de texto plano** \(\mathcal{M}\), un **espacio de texto cifrado** \(\mathcal{C}\), un **espacio de claves** \(\mathcal{K}\), y un par de algoritmos:
- Un **Algoritmo de Cifrado** \(E: \mathcal{M} \times \mathcal{K} \rightarrow \mathcal{C}\)
- Un **Algoritmo de Descifrado** \(D: \mathcal{C} \times \mathcal{K} \rightarrow \mathcal{M}\)

El requisito fundamental de corrección de la criptografía es que para cualquier texto plano \(m \in \mathcal{M}\) y clave \(k \in \mathcal{K}\):
\[D(E(m, k), k) = m\]

![Symmetric Cryptography Diagram](/images/cryptography/symmetric_encryption.png)

---
## El Cifrado César (Sustitución Monoalfabética)

El cifrado César es una de las técnicas de cifrado más antiguas registradas, nombrado en honor a Julio César, quien lo utilizaba para comunicarse con sus generales.

### Formulación Matemática
Para representar matemáticamente las letras del alfabeto inglés, las mapeamos al conjunto de enteros módulo 26:
\[\mathbb{Z}_{26} = \{0, 1, 2, \dots, 25\}\]
donde 'A' \(\mapsto 0\), 'B' \(\mapsto 1\), \dots, 'Z' \(\mapsto 25\).

Dado una clave de desplazamiento \(k \in \mathbb{Z}_{26}\), el cifrado de una sola letra \(p \in \mathbb{Z}_{26}\) es:
\[E(p, k) = (p + k) \pmod{26}\]

Y el descifrado de una letra de texto cifrado \(c \in \mathbb{Z}_{26}\) es:
\[D(c, k) = (c - k) \pmod{26}\]

__JSX_ATTR_DiagnosticQuiz_13__  |||  |||  __JSX_END_13__

### Demostración Interactiva
A continuación, puedes experimentar con el cifrado y descifrado César directamente en tu navegador.

__JSX_SELF_CodeSandbox_14__

---
## Por qué el Cifrado César está Roto: Complejidad del Espacio de Claves

La principal debilidad del cifrado César reside en su minúsculo espacio de claves. Debido a que la clave \(k\) debe ser un número entero entre \(1\) y \(25\), solo hay **25 claves posibles** (un desplazamiento de 0 o 26 no altera el texto plano).

Una intrusa, Eva, puede realizar fácilmente un **ataque de fuerza bruta** probando las 25 claves posibles hasta que lea texto plano inteligible.

__JSX_OPEN_SolvedExercise_15__
  **Problema:**
  Calcula el tamaño del espacio de claves para un cifrado de sustitución monoalfabético general, donde cada letra del alfabeto se asigna a una permutación única del alfabeto.

  **Solución:**
  En un cifrado de sustitución monoalfabético general, podemos asignar 'A' a cualquiera de las 26 letras. 'B' puede asignarse a cualquiera de las 25 letras restantes, 'C' a cualquiera de las 24 letras, y así sucesivamente.

  Por lo tanto, el tamaño del espacio de claves es el número de permutaciones de 26 elementos:
  \[|\mathcal{K}| = 26! \approx 4.03 \times 10^{26}\]

  Este es un espacio de claves masivo, mayor que \(2^{88}\). ¡Un ataque de fuerza bruta que intente 1000 millones de claves por segundo tardaría más de 12 mil millones de años en completarse!
__JSX_CLOSE_SolvedExercise_4__

---
## Análisis de Frecuencia: Rompiendo la Sustitución General

Aunque un cifrado de sustitución general tiene un espacio de claves de \(26!\), sigue siendo completamente inseguro. ¿Por qué? Porque preserva la **distribución estadística** del lenguaje subyacente.

En cualquier lenguaje natural, algunas letras ocurren con mucha más frecuencia que otras. En inglés, la 'E' es la letra más frecuente (aprox. 12.7%), seguida por la 'T', la 'A' y la 'O'. Contando las ocurrencias de cada letra en el texto cifrado, podemos mapear las letras más frecuentes del texto cifrado a las letras más frecuentes del inglés, descifrando rápidamente el código.

__JSX_SELF_SocraticInput_16__

---
## El Cifrado de Vigenère (Sustitución Polialfabética)

Para contrarrestar el análisis de frecuencias, los criptógrafos del siglo XVI desarrollaron la sustitución polialfabética. El cifrado de Vigenère utiliza una palabra clave repetida para determinar una serie de diferentes desplazamientos César.

### Formulación Matemática
Sea la clave un vector de desplazamientos \(\vec{k} = (k_0, k_1, \dots, k_{d-1})\) de período \(d\).
Para un mensaje en texto plano \(\vec{p} = (p_0, p_1, \dots)\), el elemento de texto cifrado \(c_i\) es:
\[c_i = (p_i + k_{i \pmod d}) \pmod{26}\]

Al cambiar el desplazamiento de letra en letra, Vigenère aplana la distribución de frecuencias, haciendo imposible el análisis de frecuencias simple.

__JSX_OPEN_Quiz_17__
  __JSX_ATTR_Question_18__ ¿Cuál es la técnica principal utilizada para encontrar la longitud de la clave 'd' de un cifrado de Vigenère? ||| El examen de Kasiski identifica secuencias repetidas de texto cifrado para encontrar divisores comunes de sus distancias, que representan candidatos para la longitud de la clave. La prueba de Friedman utiliza el Índice de Coincidencia. __JSX_END_18__
  __JSX_ATTR_Option_19__ Fuerza bruta de todas las 26! permutaciones de las letras __JSX_END_19__
  __JSX_ATTR_Option_20__ Búsqueda de la letra individual más frecuente en el texto cifrado __JSX_END_20__
  __JSX_ATTR_Option_21__ Examen de Kasiski o Prueba de Friedman (Índice de Coincidencia) __JSX_END_21__
  __JSX_ATTR_Option_22__ Criptoanálisis lineal utilizando registros de desplazamiento con retroalimentación __JSX_END_22__
__JSX_CLOSE_Question_5__
__JSX_CLOSE_Quiz_6__

---
## Clasificación de Tarjetas: Empareja Términos Criptográficos

Empareja los términos de criptografía clásica con sus descripciones.

__JSX_SELF_CardSort_23__

---
## Línea de Tiempo Histórica de la Criptografía Clásica

Explore los momentos clave en la historia de la criptografía clásica.

__JSX_SELF_Timeline_24__

---

__JSX_ATTR_Summary_25__  __JSX_END_25__

__JSX_SELF_WhatsNext_26__

__JSX_OPEN_References_27__
  * **Kahn, D.** (1996). *The Codebreakers: The Comprehensive History of Secret Communication from Ancient Times to the Internet*. Scribner.
  * **Shannon, C. E.** (1949). *Communication Theory of Secrecy Systems*. Bell System Technical Journal.
__JSX_CLOSE_References_7__

Your validation checklist:
1. Academic Integrity: Is the scientific/academic depth, tone, and accuracy of the original content fully preserved?
2. MDX Components Preservation: Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc.) completely present with all their JSX tags and properties intact? Do NOT generate empty components like <CriticalThinking />, <WhatsNext />, <OpenQuestion />, or <ScientificDebate /> without text/children. Do NOT nest wrapper components (e.g. nesting <WhatsNext> inside itself is strictly forbidden).
3. Custom attributes: For <Glossary>, are term/definition translated? For <HistoricalPerson>, are name/lang translated/updated? For <EssayEvaluation>, are prompt/subject translated? Are other properties (like durations, options, gradingSystem, IDs, itemsBase64 payloads) preserved exactly as in the original?
4. Formulas and Code: Are all Math equations ($...$ or $...$) and code blocks kept exactly as they were, untranslated?
5. Zero Translator Commentary: Did the translator introduce any notes, prefixes, or meta-conversational lines (e.g. "Here is the translation:")? If so, reject it.
6. Zero placeholders: Are there any placeholders or unfinished sections?
7. Assessment Integrity: Ensure all translated interactive assessments (<Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, <UnsolvedExercise>) are complete, fully populated with high-quality, non-empty text matching the target course level, length, and complexity of the subject, and verify that the translation has not broken correct option attributes (e.g. "correct" prop on <Option>, or "correctIndex" on <DiagnosticQuiz>).
8. Academic References and Figure Sources: Do NOT expect or request translation of academic references, book/article/publication titles, author names, or citation texts inside <References> components or itemsBase64 attributes. These must remain exactly as they are in the original to preserve citation integrity.
9. Immutability of Citations and Sources: Verify that "Source:" prefixes and associated bibliographic links/attributions in figure captions or narrative text remain exactly in their original language (typically English) and have not been translated. Verify that quotes (lines starting with '>') have the quote translated to the target course language, followed by its original version in brackets (e.g. `[Original: "Original quote..."]`) if different from the target course language. Ensure that if the target course language matches the quote's original language, only one quote exists (no brackets or duplication). Ensure all citation details (author, book, publisher, etc. after the '—' dash) remain untranslated. Reject the translation if bibliographic citations, original quote blocks, reference metadata, or book titles are translated.

You must output ONLY a valid JSON object matching this structure:
{
  "approved": true or false,
  "critique": "If not approved, explain exactly what is wrong/missing/broken so the translator can correct it. If approved, keep this empty."
}

[REJECT-ONLY REPORTING MANDATE]
If the translation is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the translation is approved.