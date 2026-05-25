import os
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content"

# Multi-language templates for the three Statistics chapters

# Lesson 1: Descriptive Statistics
L1_TITLE = {
    'en': 'Introduction to Descriptive Statistics',
    'fr': 'Introduction à la Statistique Descriptive',
    'es': 'Introducción a la Estadística Descriptiva',
    'de': 'Einführung in die beschreibende Statistik',
    'zh': '描述性统计导论'
}

L1_CONTENT = {
    'en': """# Introduction to Descriptive Statistics

Descriptive statistics is the discipline of quantitatively describing the main features of a collection of information. It differs from inferential statistics in that descriptive statistics aims to summarize a sample, rather than use the data to learn about the population.

## 1. Measures of Central Tendency

Central tendency represents the center of a probability distribution. The three most common measures are:

1. **Mean** (arithmetic average):
   $$\\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i$$

2. **Median**: The middle value separating the higher half from the lower half of a data sample.

3. **Mode**: The value that appears most frequently in a data set.

<MetaNote title="Analogy">
  Think of the mean as the balance point of a physical scale loaded with weights at each data point, whereas the median is simply the visual cut point that divides the population in two equal groups.
</MetaNote>

## 2. Measures of Dispersion

Dispersion measures the spread of data around the central tendency.

### 2.1 Sample Variance
The sample variance $S^2$ measures the average squared deviation from the mean:
$$S^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2$$

### 2.2 Standard Deviation
The standard deviation $S$ is the square root of the variance, returning the dispersion to the original data scale:
$$S = \\sqrt{S^2}$$

<SolvedProblem>
**Problem: Calculate descriptive statistics of exam scores**
A cohort of 5 students scored: 12, 15, 10, 18, 15.

**1. Calculate the mean:**
$$\\bar{X} = \\frac{12+15+10+18+15}{5} = \\frac{70}{5} = 14$$

**2. Calculate the variance:**
$$S^2 = \\frac{(12-14)^2 + (15-14)^2 + (10-14)^2 + (18-14)^2 + (15-14)^2}{4}$$
$$S^2 = \\frac{4 + 1 + 16 + 16 + 1}{4} = \\frac{38}{4} = 9.5$$
</SolvedProblem>

<Quiz>
  <Question q="Which measure of central tendency is highly sensitive to extreme outliers?">
    <Option text="Median" />
    <Option text="Mean" correct />
    <Option text="Mode" />
  </Question>
</Quiz>

---
*OpenPrimer Academic Standard - Mathematics Statistics L1*
""",
    'fr': """# Introduction à la Statistique Descriptive

La statistique descriptive est la discipline qui consiste à décrire quantitativement les principales caractéristiques d'une collection d'informations. Elle diffère de la statistique inférentielle en ce qu'elle vise à résumer un échantillon, plutôt qu'à utiliser les données pour en apprendre davantage sur la population globale.

## 1. Mesures de Tendance Centrale

La tendance centrale représente le centre d'une distribution de probabilités. Les trois mesures les plus courantes sont :

1. **Moyenne** (moyenne arithmétique) :
   $$\\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i$$

2. **Médiane** : La valeur centrale séparant la moitié supérieure de la moitié inférieure d'un échantillon de données.

3. **Mode** : La valeur qui apparaît le plus fréquemment dans un ensemble de données.

<MetaNote title="Analogie">
  Pensez à la moyenne comme au point d'équilibre d'une balance physique chargée de poids à chaque valeur de données, tandis que la médiane est simplement le point de coupe visuel qui divise la population en deux groupes égaux.
</MetaNote>

## 2. Mesures de Dispersion

La dispersion mesure l'étalement des données autour de la tendance centrale.

### 2.1 Variance de l'Échantillon
La variance $S^2$ mesure l'écart quadratique moyen par rapport à la moyenne :
$$S^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2$$

### 2.2 Écart Type
L'écart type $S$ est la racine carrée de la variance, ramenant la dispersion à l'échelle des données initiales :
$$S = \\sqrt{S^2}$$

<SolvedProblem>
**Problème : Calculer les statistiques descriptives de notes d'examen**
Un groupe de 5 étudiants a obtenu : 12, 15, 10, 18, 15.

**1. Calculer la moyenne :**
$$\\bar{X} = \\frac{12+15+10+18+15}{5} = \\frac{70}{5} = 14$$

**2. Calculer la variance :**
$$S^2 = \\frac{(12-14)^2 + (15-14)^2 + (10-14)^2 + (18-14)^2 + (15-14)^2}{4}$$
$$S^2 = \\frac{4 + 1 + 16 + 16 + 1}{4} = \\frac{38}{4} = 9.5$$
</SolvedProblem>

<Quiz>
  <Question q="Quelle mesure de tendance centrale est fortement sensible aux valeurs aberrantes (outliers) ?">
    <Option text="Médiane" />
    <Option text="Moyenne" correct />
    <Option text="Mode" />
  </Question>
</Quiz>

---
*Norme Académique OpenPrimer - Statistique Mathématique L1*
""",
    'es': """# Introducción a la Estadística Descriptiva

La estadística descriptiva es la disciplina de describir cuantitativamente las características principales de una colección de información. Difiere de la estadística inferencial en que su objetivo es resumir una muestra, en lugar de utilizar los datos para aprender sobre la población general.

## 1. Medidas de Tendencia Central

La tendencia central representa el centro de una distribución de probabilidad. Las tres medidas más comunes son:

1. **Media** (promedio aritmético):
   $$\\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i$$

2. **Mediana**: El valor medio que separa la mitad superior de la mitad inferior de una muestra de datos.

3. **Moda**: El valor que aparece con mayor frecuencia en un conjunto de datos.

<MetaNote title="Analogía">
  Piense en la media como el punto de equilibrio de una balanza física cargada con pesos en cada punto de datos, mientras que la mediana es simplemente el punto de corte visual que divide a la población en dos grupos iguales.
</MetaNote>

## 2. Medidas de Dispersión

La dispersión mide la propagación de los datos alrededor de la tendencia central.

### 2.1 Varianza Muestral
La varianza muestral $S^2$ mide la desviación cuadrática promedio de la media:
$$S^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2$$

### 2.2 Desviación Estándar
La desviación estándar $S$ es la raíz cuadrada de la varianza, devolviendo la dispersión a la escala de datos original:
$$S = \\sqrt{S^2}$$

<SolvedProblem>
**Problema: Calcular estadísticas descriptivas de calificaciones de exámenes**
Un grupo de 5 estudiantes obtuvo: 12, 15, 10, 18, 15.

**1. Calcular la media:**
$$\\bar{X} = \\frac{12+15+10+18+15}{5} = \\frac{70}{5} = 14$$

**2. Calcular la varianza:**
$$S^2 = \\frac{(12-14)^2 + (15-14)^2 + (10-14)^2 + (18-14)^2 + (15-14)^2}{4}$$
$$S^2 = \\frac{4 + 1 + 16 + 16 + 1}{4} = \\frac{38}{4} = 9.5$$
</SolvedProblem>

<Quiz>
  <Question q="¿Qué medida de tendencia central es altamente sensible a los valores atípicos extremos?">
    <Option text="Mediana" />
    <Option text="Media" correct />
    <Option text="Moda" />
  </Question>
</Quiz>

---
*Estándar Académico OpenPrimer - Estadística Matemática L1*
""",
    'de': """# Einführung in die beschreibende Statistik

Die beschreibende (deskriptive) Statistik befasst sich mit der quantitativen Beschreibung der Hauptmerkmale einer Informationssammlung. Sie unterscheidet sich von der schließenden Statistik dadurch, dass sie eine Stichprobe zusammenfasst, anstatt die Daten zu nutzen, um etwas über die Grundgesamtheit zu erfahren.

## 1. Maße der zentralen Tendenz

Die zentrale Tendenz repräsentiert das Zentrum einer Wahrscheinlichkeitsverteilung. Die drei häufigsten Maße sind:

1. **Mittelwert** (arithmetisches Mittel):
   $$\\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i$$

2. **Median**: Der mittlere Wert, der die obere Hälfte von der unteren Hälfte einer Stichprobe trennt.

3. **Modus**: Der Wert, der in einem Datensatz am häufigsten vorkommt.

<MetaNote title="Analogie">
  Stellen Sie sich den Mittelwert als den Schwerpunkt einer physischen Waage vor, die an jedem Datenpunkt mit Gewichten beladen ist, während der Median einfach der visuelle Schnittpunkt ist, der die Bevölkerung in zwei gleiche Gruppen teilt.
</MetaNote>

## 2. Streuungsmaße

Die Streuung (Dispersion) misst die Verteilung der Daten um die zentrale Tendenz.

### 2.1 Stichprobenvarianz
Die Stichprobenvarianz $S^2$ misst die durchschnittliche quadratische Abweichung vom Mittelwert:
$$S^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2$$

### 2.2 Standardabweichung
Die Standardabweichung $S$ ist die Quadratwurzel aus der Varianz, wodurch die Streuung auf die ursprüngliche Datenskala zurückgeführt wird:
$$S = \\sqrt{S^2}$$

<SolvedProblem>
**Aufgabe: Berechnung deskriptiver Statistiken von Prüfungsergebnissen**
Eine Gruppe von 5 Studenten erzielte: 12, 15, 10, 18, 15.

**1. Berechnen Sie den Mittelwert:**
$$\\bar{X} = \\frac{12+15+10+18+15}{5} = \\frac{70}{5} = 14$$

**2. Berechnen Sie die Varianz:**
$$S^2 = \\frac{(12-14)^2 + (15-14)^2 + (10-14)^2 + (18-14)^2 + (15-14)^2}{4}$$
$$S^2 = \\frac{4 + 1 + 16 + 16 + 1}{4} = \\frac{38}{4} = 9.5$$
</SolvedProblem>

<Quiz>
  <Question q="Welches Maß der zentralen Tendenz reagiert sehr empfindlich auf extreme Ausreißer?">
    <Option text="Median" />
    <Option text="Mittelwert" correct />
    <Option text="Modus" />
  </Question>
</Quiz>

---
*Akademischer Standard von OpenPrimer - Mathematische Statistik L1*
""",
    'zh': """# 描述性统计导论

描述性统计学是定量描述一组信息主要特征的学科。它与推断统计学的不同之处在于，描述性统计旨在总结样本，而不是使用数据来了解总体。

## 1. 集中趋势的度量

集中趋势代表概率分布的中心。三种最常用的度量是：

1. **均值**（算术平均值）：
   $$\\bar{X} = \\frac{1}{n} \\sum_{i=1}^n X_i$$

2. **中位数**：将数据样本的较高端与较低端分开的中间值。

3. **众数**：在数据集中出现频率最高的值。

<MetaNote title="比喻">
  将均值想象为在每个数据点都装有重物的物理天平的平衡点，而中位数只是将总体平分为两个相等组的视觉分割点。
</MetaNote>

## 2. 离散程度的度量

离散程度测量数据围绕集中趋势的分布。

### 2.1 样本方差
样本方差 $S^2$ 测量与均值的平均平方偏差：
$$S^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2$$

### 2.2 标准差
标准差 $S$ 是方差的平方根，将离散度还原为原始数据尺度：
$$S = \\sqrt{S^2}$$

<SolvedProblem>
**问题：计算考试成绩的描述性统计数据**
一组 5 名学生的成绩为：12, 15, 10, 18, 15。

**1. 计算均值：**
$$\\bar{X} = \\frac{12+15+10+18+15}{5} = \\frac{70}{5} = 14$$

**2. 计算方差：**
$$S^2 = \\frac{(12-14)^2 + (15-14)^2 + (10-14)^2 + (18-14)^2 + (15-14)^2}{4}$$
$$S^2 = \\frac{4 + 1 + 16 + 16 + 1}{4} = \\frac{38}{4} = 9.5$$
</SolvedProblem>

<Quiz>
  <Question q="哪种集中趋势度量对极端异常值高度敏感？">
    <Option text="中位数" />
    <Option text="均值" correct />
    <Option text="众数" />
  </Question>
</Quiz>

---
*OpenPrimer 学术标准 - 数学统计学 L1*
"""
}

# Lesson 2: Probability Foundations
L2_TITLE = {
    'en': 'Probability Theory and Foundations',
    'fr': 'Théorie des Probabilités et Fondations',
    'es': 'Teoría de la Probabilidad y Fundamentos',
    'de': 'Wahrscheinlichkeitstheorie und Grundlagen',
    'zh': '概率论与基础'
}

L2_CONTENT = {
    'en': """# Probability Theory and Foundations

Probability theory is the mathematical framework for modeling uncertainty. A rigorous mathematical formulation was established by Andrey Kolmogorov using measure theory.

## 1. Axiomatic Definition of Probability

Given a sample space $\\Omega$ and a $\\sigma$-algebra $\\mathcal{F}$ of events, a probability measure $P$ is a function mapping events to real numbers that satisfies Kolmogorov's Axioms:

1. **Non-negativity**: $P(A) \\ge 0$ for all $A \\in \\mathcal{F}$.
2. **Normalization**: $P(\\Omega) = 1$.
3. **Countable Additivity**: For disjoint events $A_1, A_2, \\dots$:
   $$P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$$

## 2. Conditional Probability and Bayes' Theorem

### 2.1 Conditional Probability
The probability of event $A$ occurring given that event $B$ has already occurred is:
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{if } P(B) > 0$$

### 2.2 Bayes' Theorem
Bayes' Theorem relates conditional and marginal probabilities of stochastic events:
$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

Where $P(B)$ can be expanded using the law of total probability:
$$P(B) = \\sum_{k} P(B|A_k)P(A_k)$$

<MetaNote title="Analogy">
  Bayes' Theorem is the mathematical machine for updating our beliefs. The prior $P(A)$ is what we believe before observing the evidence $B$. The posterior $P(A|B)$ is our corrected belief.
</MetaNote>

<SolvedProblem>
**Problem: Diagnostic Test Accuracy**
A rare disease affects 1% of the population. A diagnostic test is 99% accurate (true positive rate is 99%, and true negative rate is 99%).
What is the probability a person has the disease given they tested positive?

**1. Identify parameters:**
- Prior $P(D) = 0.01$ (and $P(D^c) = 0.99$)
- Sensitivity $P(+|D) = 0.99$
- False Positive Rate $P(+|D^c) = 0.01$

**2. Apply Bayes' Theorem:**
$$P(D|+) = \\frac{P(+|D)P(D)}{P(+|D)P(D) + P(+|D^c)P(D^c)}$$
$$P(D|+) = \\frac{0.99 \\times 0.01}{0.99 \\times 0.01 + 0.01 \\times 0.99} = \\frac{0.0099}{0.0099 + 0.0099} = 0.50$$

**Conclusion:** There is only a 50% chance the patient has the disease, despite the 99% accurate test, due to the low prior probability of the disease.
</SolvedProblem>

<Quiz>
  <Question q="What is the result of P(A) + P(A^c) according to probability axioms?">
    <Option text="0.5" />
    <Option text="1.0" correct />
    <Option text="0.0" />
  </Question>
</Quiz>

---
*OpenPrimer Academic Standard - Mathematics Statistics L1*
""",
    'fr': """# Théorie des Probabilités et Fondations

La théorie des probabilités est le cadre mathématique permettant de modéliser l'incertitude. Une formulation mathématique rigoureuse a été établie par Andreï Kolmogorov en utilisant la théorie de la mesure.

## 1. Définition Axiomatique de la Probabilité

Étant donné un espace échantillon $\\Omega$ et une $\\sigma$-algèbre $\\mathcal{F}$ d'événements, une mesure de probabilité $P$ est une fonction associant des événements à des nombres réels qui satisfait aux axiomes de Kolmogorov :

1. **Non-négativité** : $P(A) \\ge 0$ pour tout $A \\in \\mathcal{F}$.
2. **Normalisation** : $P(\\Omega) = 1$.
3. **Additivité dénombrable** : Pour des événements disjoints $A_1, A_2, \\dots$ :
   $$P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$$

## 2. Probabilité Conditionnelle et Théorème de Bayes

### 2.1 Probabilité Conditionnelle
La probabilité qu'un événement $A$ se produise sachant qu'un événement $B$ s'est déjà produit est :
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{si } P(B) > 0$$

### 2.2 Théorème de Bayes
Le théorème de Bayes relie les probabilités conditionnelles et marginales d'événements stochastiques :
$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

Où $P(B)$ peut être développé à l'aide de la loi des probabilités totales :
$$P(B) = \\sum_{k} P(B|A_k)P(A_k)$$

<MetaNote title="Analogie">
  Le théorème de Bayes est la machine mathématique permettant de mettre à jour nos croyances. Le 'prior' $P(A)$ est ce que nous croyons avant d'observer la preuve $B$. Le 'posterior' $P(A|B)$ est notre croyance corrigée.
</MetaNote>

<SolvedProblem>
**Problème : Précision d'un Test Diagnostic**
Une maladie rare affecte 1 % de la population. Un test de diagnostic est fiable à 99 % (le taux de vrais positifs est de 99 % et le taux de vrais négatifs est de 99 %).
Quelle est la probabilité qu'une personne ait la maladie sachant qu'elle a été testée positive ?

**1. Identifier les paramètres :**
- Prior $P(D) = 0,01$ (et $P(D^c) = 0,99$)
- Sensibilité $P(+|D) = 0,99$
- Taux de faux positifs $P(+|D^c) = 0,01$

**2. Appliquer le théorème de Bayes :**
$$P(D|+) = \\frac{P(+|D)P(D)}{P(+|D)P(D) + P(+|D^c)P(D^c)}$$
$$P(D|+) = \\frac{0,99 \\times 0,01}{0,99 \\times 0,01 + 0,01 \\times 0,99} = \\frac{0,0099}{0,0099 + 0,0099} = 0,50$$

**Conclusion :** Il n'y a que 50 % de chances que le patient ait la maladie, malgré un test fiable à 99 %, en raison de la faible probabilité 'prior' de la maladie.
</SolvedProblem>

<Quiz>
  <Question q="Quel est le résultat de P(A) + P(A^c) selon les axiomes des probabilités ?">
    <Option text="0,5" />
    <Option text="1,0" correct />
    <Option text="0,0" />
  </Question>
</Quiz>

---
*Norme Académique OpenPrimer - Statistique Mathématique L1*
""",
    'es': """# Teoría de la Probabilidad y Fundamentos

La teoría de la probabilidad es el marco matemático para modelar la incertidumbre. Andrei Kolmogorov estableció una formulación matemática rigurosa utilizando la teoría de la medida.

## 1. Definición Axiomática de Probabilidad

Dado un espacio muestral $\\Omega$ y una $\\sigma$-álgebra $\\mathcal{F}$ de eventos, una medida de probabilidad $P$ es una función que asigna eventos a números reales que satisface los Axiomas de Kolmogorov:

1. **No negatividad**: $P(A) \\ge 0$ para todo $A \\in \\mathcal{F}$.
2. **Normalización**: $P(\\Omega) = 1$.
3. **Aditividad contable**: Para eventos disjuntos $A_1, A_2, \\dots$:
   $$P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$$

## 2. Probabilidad Condicional y Teorema de Bayes

### 2.1 Probabilidad Condicional
La probabilidad de que ocurra el evento $A$ dado que el evento $B$ ya ocurrió es:
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{si } P(B) > 0$$

### 2.2 Teorema de Bayes
El Teorema de Bayes relaciona las probabilidades condicionales y marginales de eventos estocásticos:
$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

Donde $P(B)$ se puede expandir usando la ley de probabilidad total:
$$P(B) = \\sum_{k} P(B|A_k)P(A_k)$$

<MetaNote title="Analogía">
  El Teorema de Bayes es la máquina matemática para actualizar nuestras creencias. La probabilidad previa $P(A)$ es lo que creemos antes de observar la evidencia $B$. La probabilidad posterior $P(A|B)$ es nuestra creencia corregida.
</MetaNote>

<SolvedProblem>
**Problema: Precisión de una Prueba de Diagnóstico**
Una enfermedad rara afecta al 1% de la población. Una prueba de diagnóstico tiene un 99% de precisión (la tasa de verdaderos positivos es del 99% y la tasa de verdaderos negativos es del 99%).
¿Cuál es la probabilidad de que una persona tenga la enfermedad dado que dio positivo en la prueba?

**1. Identificar parámetros:**
- Previa $P(D) = 0.01$ (y $P(D^c) = 0.99$)
- Sensibilidad $P(+|D) = 0.99$
- Tasa de falsos positivos $P(+|D^c) = 0.01$

**2. Aplicar el Teorema de Bayes:**
$$P(D|+) = \\frac{P(+|D)P(D)}{P(+|D)P(D) + P(+|D^c)P(D^c)}$$
$$P(D|+) = \\frac{0.99 \\times 0.01}{0.99 \\times 0.01 + 0.01 \\times 0.99} = \\frac{0.0099}{0.0099 + 0.0099} = 0.50$$

**Conclusión:** Solo hay un 50% de probabilidad de que el paciente tenga la enfermedad, a pesar de la prueba de precisión del 99%, debido a la baja probabilidad previa de la enfermedad.
</SolvedProblem>

<Quiz>
  <Question q="¿Cuál es el resultado de P(A) + P(A^c) según los axiomas de la probabilidad?">
    <Option text="0.5" />
    <Option text="1.0" correct />
    <Option text="0.0" />
  </Question>
</Quiz>

---
*Estándar Académico OpenPrimer - Estadística Matemática L1*
""",
    'de': """# Wahrscheinlichkeitstheorie und Grundlagen

Die Wahrscheinlichkeitstheorie ist der mathematische Rahmen zur Modellierung von Unsicherheit. Eine strenge mathematische Formulierung wurde von Andrei Kolmogorow unter Verwendung der Maßtheorie etabliert.

## 1. Axiomatische Definition der Wahrscheinlichkeit

Gegeben sei ein Ergebnisraum $\\Omega$ und eine $\\sigma$-Algebra $\\mathcal{F}$ von Ereignissen. Ein Wahrscheinlichkeitsmaß $P$ ist eine Funktion, die Ereignissen reelle Zahlen zuordnet und die Kolmogorov-Axiome erfüllt:

1. **Nichtnegativität**: $P(A) \\ge 0$ für alle $A \\in \\mathcal{F}$.
2. **Normiertheit**: $P(\\Omega) = 1$.
3. **Abzählbare Additivität** (sigma-Additivität): Für paarweise disjunkte Ereignisse $A_1, A_2, \\dots$:
   $$P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$$

## 2. Bedingte Wahrscheinlichkeit und Satz von Bayes

### 2.1 Bedingte Wahrscheinlichkeit
Die Wahrscheinlichkeit, dass das Ereignis $A$ eintritt, unter der Bedingung, dass das Ereignis $B$ bereits eingetreten ist, ist:
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{falls } P(B) > 0$$

### 2.2 Satz von Bayes
Der Satz von Bayes setzt die bedingte Wahrscheinlichkeit zweier stochastischer Ereignisse in Beziehung:
$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

Wobei $P(B)$ mithilfe der Formel der totalen Wahrscheinlichkeit erweitert werden kann:
$$P(B) = \\sum_{k} P(B|A_k)P(A_k)$$

<MetaNote title="Analogie">
  Der Satz von Bayes ist die mathematische Maschine zur Aktualisierung unserer Überzeugungen. Der Prior $P(A)$ ist das, was wir glauben, bevor wir die Beweise $B$ sehen. Der Posterior $P(A|B)$ ist unsere korrigierte Überzeugung.
</MetaNote>

<SolvedProblem>
**Aufgabe: Genauigkeit eines Diagnosetests**
Eine seltene Krankheit betrifft 1 % der Bevölkerung. Ein Diagnosetest ist zu 99 % genau (Richtig-Positiv-Rate ist 99 % und Richtig-Negativ-Rate ist 99 %).
Wie hoch ist die Wahrscheinlichkeit, dass eine Person die Krankheit hat, unter der Bedingung, dass sie positiv getestet wurde?

**1. Identifizieren Sie die Parameter:**
- Prior $P(D) = 0,01$ (und $P(D^c) = 0,99$)
- Sensitivität $P(+|D) = 0,99$
- Falsch-Positiv-Rate $P(+|D^c) = 0,01$

**2. Wenden Sie den Satz von Bayes an:**
$$P(D|+) = \\frac{P(+|D)P(D)}{P(+|D)P(D) + P(+|D^c)P(D^c)}$$
$$P(D|+) = \\frac{0,99 \\times 0,01}{0,99 \\times 0,01 + 0,01 \\times 0,99} = \\frac{0,0099}{0,0099 + 0,0099} = 0,50$$

**Fazit:** Die Wahrscheinlichkeit, dass der Patient die Krankheit tatsächlich hat, beträgt trotz des zu 99 % genauen Tests nur 50 %, was an der niedrigen Prior-Wahrscheinlichkeit der Krankheit liegt.
</SolvedProblem>

<Quiz>
  <Question q="Was ist das Ergebnis von P(A) + P(A^c) gemäß den Wahrscheinlichkeitsaxiomen?">
    <Option text="0,5" />
    <Option text="1,0" correct />
    <Option text="0,0" />
  </Question>
</Quiz>

---
*Akademischer Standard von OpenPrimer - Mathematische Statistik L1*
""",
    'zh': """# 概率论与基础

概率论是模拟不确定性的数学框架。安德雷·柯尔莫哥洛夫利用测度论建立了严密的数学公式体系。

## 1. 概率的公理化定义

给定样本空间 $\\Omega$ 和事件域 $\\mathcal{F}$，概率测度 $P$ 是一个将事件映射到实数的函数，并满足柯尔莫哥洛夫公理：

1. **非负性**：对所有 $A \\in \\mathcal{F}$，$P(A) \\ge 0$。
2. **正则性**：$P(\\Omega) = 1$。
3. **可列可加性**：对于互不相交的事件 $A_1, A_2, \\dots$：
   $$P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$$

## 2. 条件概率与贝叶斯定理

### 2.1 条件概率
在事件 $B$ 已经发生的条件下，事件 $A$ 发生的概率为：
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{如果 } P(B) > 0$$

### 2.2 贝叶斯定理
贝叶斯定理将随机事件的条件概率与边缘概率联系起来：
$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

其中可以使用全概率公式展开 $P(B)$：
$$P(B) = \\sum_{k} P(B|A_k)P(A_k)$$

<MetaNote title="比喻">
  贝叶斯定理是更新我们信念的数学机器。先验概率 $P(A)$ 是我们在观察到证据 $B$ 之前所相信的。后验概率 $P(A|B)$ 是我们修正后的信念。
</MetaNote>

<SolvedProblem>
**问题：诊断测试准确率**
一种罕见疾病影响着 1% 的人口。某种诊断测试的准确率为 99%（真阳性率为 99%，真阴性率为 99%）。
如果一个人检测结果呈阳性，那么他确实患有该疾病的概率是多少？

**1. 确定参数：**
- 先验 $P(D) = 0.01$（以及 $P(D^c) = 0.99$）
- 敏感度 $P(+|D) = 0.99$
- 假阳性率 $P(+|D^c) = 0.01$

**2. 应用贝叶斯定理：**
$$P(D|+) = \\frac{P(+|D)P(D)}{P(+|D)P(D) + P(+|D^c)P(D^c)}$$
$$P(D|+) = \\frac{0.99 \\times 0.01}{0.99 \\times 0.01 + 0.01 \\times 0.99} = \\frac{0.0099}{0.0099 + 0.0099} = 0.50$$

**结论：** 尽管测试准确率高达 99%，但由于该疾病的先验概率极低，患者实际患病的概率仅为 50%。
</SolvedProblem>

<Quiz>
  <Question q="根据概率公理，P(A) + P(A^c) 的结果是什么？">
    <Option text="0.5" />
    <Option text="1.0" correct />
    <Option text="0.0" />
  </Question>
</Quiz>

---
*OpenPrimer 学术标准 - 数学统计学 L1*
"""
}

# Lesson 3: Inferential Statistics
L3_TITLE = {
    'en': 'Inferential Statistics and Estimation',
    'fr': 'Statistique Inférentielle et Estimation',
    'es': 'Estadística Inferencial y Estimación',
    'de': 'Schließende Statistik und Schätzung',
    'zh': '推断统计学与估计'
}

L3_CONTENT = {
    'en': """# Inferential Statistics and Estimation

Inferential statistics uses a random sample of data taken from a population to describe and make inferences about the population.

## 1. The Central Limit Theorem (CLT)

The Central Limit Theorem is the foundation of inferential statistics. It states that, given a sufficiently large sample size $n$ (usually $n \\ge 30$), the sampling distribution of the sample mean $\\bar{X}$ will be approximately normally distributed, regardless of the population's distribution:
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

## 2. Confidence Intervals

A confidence interval gives an estimated range of values which is likely to include an unknown population parameter.

### 2.1 Interval for Mean with Known Variance
The $1-\\alpha$ confidence interval for the population mean $\\mu$ when variance $\\sigma^2$ is known is:
$$\\bar{X} \\pm Z_{\\alpha/2} \\left( \\frac{\\sigma}{\\sqrt{n}} \\right)$$

For a 95% confidence level, $\\alpha = 0.05$ and $Z_{0.025} = 1.96$.

<MetaNote title="Analogy">
  Think of a confidence interval as casting a net to catch a fish (the true parameter $\\mu$). The confidence level is the probability that our net actually captures the fish if we repeat the process many times.
</MetaNote>

<SolvedProblem>
**Problem: Compute 95% Confidence Interval**
A researcher measures the height of 100 plants. The sample mean is $\\bar{X} = 15$ cm. The known population standard deviation is $\\sigma = 2$ cm.

**1. Calculate the standard error:**
$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{100}} = 0.2$$

**2. Calculate the margins of error:**
$$ME = 1.96 \\times 0.2 = 0.392$$

**3. Construct the interval:**
$$CI = 15 \\pm 0.392 \\implies [14.608, 15.392]$$

**Conclusion:** We are 95% confident that the true population mean plant height lies between 14.61 cm and 15.39 cm.
</SolvedProblem>

<Quiz>
  <Question q="What does the Central Limit Theorem require for the population distribution?">
    <Option text="Must be normal" />
    <Option text="Can be any distribution shape (with finite variance)" correct />
    <Option text="Must be uniform" />
  </Question>
</Quiz>

---
*OpenPrimer Academic Standard - Mathematics Statistics L1*
""",
    'fr': """# Statistique Inférentielle et Estimation

La statistique inférentielle utilise un échantillon aléatoire de données prélevées dans une population pour décrire et faire des inférences sur cette population.

## 1. Le Théorème Central Limite (TCL)

Le théorème central limite est le fondement de la statistique inférentielle. Il stipule que, pour un échantillon de taille $n$ suffisamment grande (généralement $n \\ge 30$), la distribution d'échantillonnage de la moyenne échantillonnale $\\bar{X}$ suit approximativement une loi normale, quelle que soit la distribution de la population d'origine :
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

## 2. Intervalles de Confiance

Un intervalle de confiance fournit une plage de valeurs estimée susceptible de contenir un paramètre de population inconnu.

### 2.1 Intervalle pour la Moyenne avec Variance Connue
L'intervalle de confiance à $1-\\alpha$ pour la moyenne de la population $\\mu$ lorsque la variance $\\sigma^2$ est connue est :
$$\\bar{X} \\pm Z_{\\alpha/2} \\left( \\frac{\\sigma}{\\sqrt{n}} \\right)$$

Pour un niveau de confiance de 95 %, $\\alpha = 0,05$ et $Z_{0,025} = 1,96$.

<MetaNote title="Analogie">
  Pensez à un intervalle de confiance comme au fait de jeter un filet pour attraper un poisson (le vrai paramètre $\\mu$). Le niveau de confiance est la probabilité que notre filet capture effectivement le poisson si nous répétions le processus un grand nombre de fois.
</MetaNote>

<SolvedProblem>
**Problème : Calculer un Intervalle de Confiance à 95 %**
Un chercheur mesure la hauteur de 100 plantes. La moyenne de l'échantillon est $\\bar{X} = 15$ cm. L'écart type connu de la population est $\\sigma = 2$ cm.

**1. Calculer l'erreur type :**
$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{100}} = 0,2$$

**2. Calculer la marge d'erreur :**
$$ME = 1,96 \\times 0,2 = 0,392$$

**3. Construire l'intervalle :**
$$CI = 15 \\pm 0,392 \\implies [14,608, 15,392]$$

**Conclusion :** Nous sommes confiants à 95 % que la véritable moyenne de la hauteur des plantes de la population se situe entre 14,61 cm et 15,39 cm.
</SolvedProblem>

<Quiz>
  <Question q="Que requiert le Théorème Central Limite concernant la distribution de la population d'origine ?">
    <Option text="Elle doit être normale" />
    <Option text="Elle peut avoir n'importe quelle forme (avec une variance finie)" correct />
    <Option text="Elle doit être uniforme" />
  </Question>
</Quiz>

---
*Norme Académique OpenPrimer - Statistique Mathématique L1*
""",
    'es': """# Estadística Inferencial y Estimación

La estadística inferencial utiliza una muestra aleatoria de datos tomados de una población para describir y realizar inferencias sobre la población general.

## 1. El Teorema del Límite Central (TLC)

El Teorema del Límite Central es la base de la estadística inferencial. Establece que, dado un tamaño de muestra $n$ suficientemente grande (generalmente $n \\ge 30$), la distribución muestral de la media muestral $\\bar{X}$ se aproximará a una distribución normal, independientemente de la distribución de la población:
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

## 2. Intervalos de Confianza

Un intervalo de confianza proporciona un rango estimado de valores que probablemente incluya un parámetro poblacional desconocido.

### 2.1 Intervalo para la Media con Varianza Conocida
El intervalo de confianza de $1-\\alpha$ para la media poblacional $\\mu$ cuando se conoce la varianza $\\sigma^2$ es:
$$\\bar{X} \\pm Z_{\\alpha/2} \\left( \\frac{\\sigma}{\\sqrt{n}} \\right)$$

Para un nivel de confianza del 95%, $\\alpha = 0.05$ y $Z_{0.025} = 1.96$.

<MetaNote title="Analogía">
  Piense en un intervalo de confianza como lanzar una red para pescar un pez (el parámetro real $\\mu$). El nivel de confianza es la probabilidad de que nuestra red realmente capture el pez si repetimos el proceso muchas veces.
</MetaNote>

<SolvedProblem>
**Problema: Calcular Intervalo de Confianza del 95%**
Un investigador mide la altura de 100 plantas. La media muestral es $\\bar{X} = 15$ cm. La desviación estándar conocida de la población es $\\sigma = 2$ cm.

**1. Calcular el error estándar:**
$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{100}} = 0.2$$

**2. Calcular los márgenes de error:**
$$ME = 1.96 \\times 0.2 = 0.392$$

**3. Construir el intervalo:**
$$CI = 15 \\pm 0.392 \\implies [14.608, 15.392]$$

**Conclusión:** Tenemos un 95% de confianza en que la verdadera media poblacional de la altura de las plantas se encuentra entre 14.61 cm y 15.39 cm.
</SolvedProblem>

<Quiz>
  <Question q="¿Qué requiere el Teorema del Límite Central para la distribución de la población?">
    <Option text="Debe ser normal" />
    <Option text="Puede ser cualquier forma de distribución (con varianza finita)" correct />
    <Option text="Debe ser uniforme" />
  </Question>
</Quiz>

---
*Estándar Académico OpenPrimer - Estadística Matemática L1*
""",
    'de': """# Schließende Statistik und Schätzung

Die schließende (induktive) Statistik verwendet eine zufällige Stichprobe von Daten aus einer Grundgesamtheit, um diese zu beschreiben und Rückschlüsse auf sie zu ziehen.

## 1. Der zentrale Grenzwertsatz (ZGS)

Der zentrale Grenzwertsatz ist das Fundament der schließenden Statistik. Er besagt, dass bei einem ausreichend großen Stichprobenumfang $n$ (normalerweise $n \\ge 30$) die Stichprobenverteilung des Stichprobenmittelwerts $\\bar{X}$ näherungsweise normalverteilt ist, unabhängig von der Verteilung der Grundgesamtheit:
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

## 2. Konfidenzintervalle

Ein Konfidenzintervall gibt einen geschätzten Wertebereich an, der wahrscheinlich einen unbekannten Parameter der Grundgesamtheit enthält.

### 2.1 Intervall für den Mittelwert bei bekannter Varianz
Das $1-\\alpha$-Konfidenzintervall für den Mittelwert $\\mu$ der Grundgesamtheit bei bekannter Varianz $\\sigma^2$ lautet:
$$\\bar{X} \\pm Z_{\\alpha/2} \\left( \\frac{\\sigma}{\\sqrt{n}} \\right)$$

Für ein Konfidenzniveau von 95 % ist $\\alpha = 0,05$ und $Z_{0,025} = 1,96$.

<MetaNote title="Analogie">
  Stellen Sie sich ein Konfidenzintervall wie das Auswerfen eines Netzes vor, um einen Fisch zu fangen (den wahren Parameter $\\mu$). Das Konfidenzniveau ist die Wahrscheinlichkeit, mit der unser Netz den Fisch tatsächlich fängt, wenn wir den Vorgang viele Male wiederholen.
</MetaNote>

<SolvedProblem>
**Aufgabe: Berechnung eines 95%-Konfidenzintervalls**
Ein Forscher misst die Höhe von 100 Pflanzen. Der Stichprobenmittelwert beträgt $\\bar{X} = 15$ cm. Die bekannte Standardabweichung der Grundgesamtheit beträgt $\\sigma = 2$ cm.

**1. Berechnen Sie den Standardfehler:**
$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{100}} = 0,2$$

**2. Berechnen Sie die Fehlermarge:**
$$ME = 1,96 \\times 0,2 = 0,392$$

**3. Konstruieren Sie das Intervall:**
$$CI = 15 \\pm 0,392 \\implies [14,608, 15,392]$$

**Fazit:** Wir sind zu 95 % sicher, dass der tatsächliche Mittelwert der Pflanzenhöhe in der Grundgesamtheit zwischen 14,61 cm und 15,39 cm liegt.
</SolvedProblem>

<Quiz>
  <Question q="Was setzt der zentrale Grenzwertsatz für die Verteilung der Grundgesamtheit voraus?">
    <Option text="Muss normalverteilt sein" />
    <Option text="Kann jede beliebige Verteilungsform sein (mit endlicher Varianz)" correct />
    <Option text="Muss gleichverteilt sein" />
  </Question>
</Quiz>

---
*Akademischer Standard von OpenPrimer - Mathematische Statistik L1*
""",
    'zh': """# 推断统计学与估计

推断统计学利用从总体中抽取的随机样本数据来描述总体并对其进行推断。

## 1. 中心极限定理 (CLT)

中心极限定理是推断统计学的基石。它指出，只要样本量 $n$ 足够大（通常 $n \\ge 30$），无论总体的原始分布如何，样本均值 $\\bar{X}$ 的抽样分布都将近似服从正态分布：
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

## 2. 置信区间

置信区间提供了一个估计的值范围，该范围很可能包含未知的总体参数。

### 2.1 已知方差的均值区间
当总体方差 $\\sigma^2$ 已知时，总体均值 $\\mu$ 的 $1-\\alpha$ 置信区间为：
$$\\bar{X} \\pm Z_{\\alpha/2} \\left( \\frac{\\sigma}{\\sqrt{n}} \\right)$$

对于 95% 的置信水平，$\\alpha = 0.05$，且 $Z_{0.025} = 1.96$。

<MetaNote title="比喻">
  将置信区间想象为撒网捕鱼（真实的总体参数 $\\mu$）。置信水平就是如果我们重复这个过程很多次，我们的网实际捕获这条鱼的概率。
</MetaNote>

<SolvedProblem>
**问题：计算 95% 置信区间**
研究人员测量了 100 株植物的高度。样本均值 $\\bar{X} = 15$ 厘米。已知的总体标准差 $\\sigma = 2$ 厘米。

**1. 计算标准误：**
$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{100}} = 0.2$$

**2. 计算误差幅度：**
$$ME = 1.96 \\times 0.2 = 0.392$$

**3. 构建置信区间：**
$$CI = 15 \\pm 0.392 \\implies [14.608, 15.392]$$

**结论：** 我们有 95% 的把握认为植物高度的真实总体均值介于 14.61 厘米与 15.39 厘米之间。
</SolvedProblem>

<Quiz>
  <Question q="中心极限定理对总体原始分布有什么要求？">
    <Option text="必须是正态分布" />
    <Option text="可以是任意形状的分布（只要方差有限）" correct />
    <Option text="必须是均匀分布" />
  </Question>
</Quiz>

---
*OpenPrimer 学术标准 - 数学统计学 L1*
"""
}

def generate_statistics_course():
    # Make Statistics directories
    stats_dir = CONTENT_DIR / "L1" / "Mathematics" / "Statistics"
    stats_dir.mkdir(parents=True, exist_ok=True)
    
    lessons = [
        ("descriptive_statistics", L1_TITLE, L1_CONTENT),
        ("probability_foundations", L2_TITLE, L2_CONTENT),
        ("inferential_statistics", L3_TITLE, L3_CONTENT)
    ]
    
    print("--- Running AI Statistics Course Generation Agent ---")
    
    for slug, titles, contents in lessons:
        for lang in ['en', 'fr', 'es', 'de', 'zh']:
            file_name = f"{slug}.{lang}.mdx"
            file_path = stats_dir / file_name
            
            # Form frontmatter
            frontmatter = f"""---
title: "{titles[lang]}"
level: "L1"
subject: "Mathematics"
module: "Statistics"
section: {lessons.index((slug, titles, contents))}
version: "1.0.0"
updatedAt: "2026-05-25"
lang: "{lang}"
---

"""
            full_content = frontmatter + contents[lang]
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(full_content)
                
            print(f"Saved: {file_path}")
            
    print("Generation complete! All 15 dynamic MDX course modules successfully constructed.")

if __name__ == "__main__":
    generate_statistics_course()
