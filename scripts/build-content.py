import json
from pathlib import Path
lessons=[]; questions=[]
def lesson(id,skill,title,subtitle,rule,examples,tip):
 lessons.append(dict(id=id,skill=skill,title=title,subtitle=subtitle,rule=rule,examples=examples,tip=tip))
def q(skill,lid,level,prompt,good,bad,explanation,tip=None):
 i=len(questions); choices=[good]+bad; shift=i%len(choices); choices=choices[shift:]+choices[:shift]
 questions.append(dict(id=f'q{i+1:03}',skill=skill,lessonId=lid,level=level,prompt=prompt,choices=choices,answer=choices.index(good),explanation=explanation,tip=tip or next(l['tip'] for l in lessons if l['id']==lid)))
lesson('on-ont','homophones','On ou ont ?','Un pronom ou un verbe','« On » est un pronom sujet : on parle. « Ont » est le verbe avoir au présent, à la troisième personne du pluriel.','On apprend chaque jour.|Ils ont appris la règle.|On a le temps.'.split('|'),'Remplace « ont » par « avaient ». Si la phrase reste correcte, écris « ont ». « On » peut souvent être remplacé par « il ».')
lesson('ces-ses','homophones','Ces, ses, c’est, s’est','Montrer, posséder ou conjuguer','« Ces » montre plusieurs éléments. « Ses » indique une possession. « C’est » signifie « cela est ». « S’est » accompagne un verbe pronominal au passé composé.','Ces livres sont beaux.|Elle range ses livres.|C’est une bonne idée.|Il s’est levé tôt.'.split('|'),'Au singulier, ces donne ce/cette et ses donne son/sa. C’est peut devenir cela est. Pour s’est, change le sujet : il s’est levé → je me suis levé.')
lesson('a-et-son','homophones','Les petits mots qui changent tout','A/à, et/est, son/sont, ou/où','« A », « est » et « sont » sont des verbes. « À » est une préposition. « Et » relie des éléments. « Son » est un déterminant possessif. « Ou » propose un choix ; « où » indique notamment un lieu.','Elle a rendez-vous à midi.|Il est calme et attentif.|Son livre et ses cahiers sont ici.|Où vas-tu ? Ici ou là ?'.split('|'),'Essaie « avait », « était », « étaient » pour reconnaître les verbes. Pour « ou », essaie « ou bien ».')
lesson('ce-se','homophones','Ce, se, leur et leurs','Reconnaître le rôle du mot','« Ce » peut accompagner un nom masculin ou être un pronom. « Se » accompagne un verbe pronominal. Devant un verbe, « leur » est un pronom invariable ; devant un nom, « leur » ou « leurs » s’accorde avec ce nom.','Ce matin, elle se prépare.|Je leur écris.|Ils prennent leurs cahiers.|Ils retrouvent leur professeur.'.split('|'),'Repère le mot qui suit : un nom ou un verbe ? Le rôle du mot te donne la règle.')
lesson('en-on','homophones','En et on à l’oral et à l’écrit','Deux sons, deux emplois','« On » est un pronom sujet. « En » peut être une préposition ou un pronom qui remplace notamment un complément introduit par « de ». Leurs voyelles nasales sont distinctes en français standard, avec des variations selon les accents.','On part en train.|Tu veux du pain ? J’en veux.|On en parle demain.'.split('|'),'On peut devenir il/elle. En peut reprendre un complément : j’en veux → je veux du pain. En est aussi une préposition : en train. Il n’a pas un remplacement universel.')
lesson('determinants','grammaire','Ce, cet, cette, ces','Le bon déterminant démonstratif','Devant un nom masculin singulier : « ce », ou « cet » si le mot qui suit commence par une voyelle ou un h muet. Au féminin singulier : « cette ». Au pluriel : « ces ». Le h aspiré empêche « cet ».','Ce livre.|Cet arbre.|Cet excellent livre.|Cette histoire.|Ces arbres.|Ce héros.'.split('|'),'Identifie d’abord le genre et le nombre. Au masculin singulier, regarde le début du mot immédiatement suivant.')
lesson('accords','grammaire','Accorder les mots','Nom, adjectif et verbe','L’adjectif s’accorde généralement avec le nom en genre et en nombre. Le verbe s’accorde avec son sujet, même lorsqu’un complément les sépare.','Des maisons blanches.|Les enfants du quartier jouent.|Une réponse précise.'.split('|'),'Trouve le nom auquel se rapporte l’adjectif et le sujet réel du verbe.')
lesson('participes','grammaire','Les participes passés','Être, avoir et complément direct','Avec « être », le participe passé s’accorde généralement avec le sujet. Avec « avoir », il s’accorde avec le complément d’objet direct si celui-ci est placé avant le verbe. Les verbes pronominaux demandent une analyse particulière.','Elles sont arrivées.|Elle a écrit des lettres.|Les lettres qu’elle a écrites.|Elles se sont parlé.'.split('|'),'Avec « avoir », demande « a fait quoi ? ». Si la réponse est placée avant, vérifie l’accord.')
lesson('phrases','grammaire','Construire une phrase juste','Pronoms, négation et prépositions','Une phrase écrite doit articuler clairement ses éléments. En français standard écrit, la négation comporte habituellement « ne » et un second élément. « Dont » remplace un complément construit avec « de ».','Je ne comprends pas.|Le livre dont je parle.|Malgré la pluie, nous sortons.|Après qu’il est parti, nous avons rangé.'.split('|'),'Retrouve la construction du verbe : parler de → dont ; penser à → auquel, à laquelle…')
lesson('present','conjugaison','Les bases du présent','Des formes fréquentes à maîtriser','Le sujet détermine la terminaison du verbe. Certains verbes fréquents sont irréguliers : je fais, vous faites, ils font ; je prends, nous prenons, ils prennent.','Tu finis.|Vous dites.|Nous faisons.|Ils prennent.'.split('|'),'Apprends les formes avec leur pronom sujet, puis réutilise-les dans une phrase.')
lesson('temps','conjugaison','Raconter au passé','Imparfait et passé composé','L’imparfait présente souvent une habitude ou un arrière-plan. Le passé composé présente généralement un événement accompli. Le plus-que-parfait situe un fait avant un autre fait passé.','Chaque été, nous lisions.|Hier, nous avons lu ce livre.|Quand elle est arrivée, j’avais terminé.'.split('|'),'Demande-toi si tu décris une habitude, un événement achevé ou un fait antérieur.')
lesson('modes','conjugaison','Futur, conditionnel, subjonctif','Exprimer un projet, une condition ou une nécessité','Le futur exprime notamment un fait à venir. Le conditionnel peut exprimer une hypothèse ou une demande polie. Après « il faut que », on emploie le subjonctif. Dans une condition, « si » suivi de l’imparfait appelle souvent le conditionnel dans l’autre proposition.','Demain, je viendrai.|Si je pouvais, je viendrais.|Il faut que tu viennes.|Je souhaiterais un renseignement.'.split('|'),'Pour distinguer « je serai » et « je serais », essaie « nous serons » ou « nous serions ».')
lesson('accents','orthographe','Les accents font sens','É, è, ê et à','Les accents font partie de l’orthographe. Ils peuvent distinguer des mots : ou/où, a/à, du/dû. Les majuscules conservent leurs accents. Certains mots admettent plusieurs graphies reconnues.','Une école.|Un élève.|Un événement ou un évènement.|À bientôt.|Il a dû partir.'.split('|'),'Mémorise le mot entier dans une courte phrase et garde les accents lors des dictées.')
lesson('mots','orthographe','Les mots qui résistent','Doubles consonnes et familles de mots','L’orthographe d’un mot s’apprend avec son sens, sa famille et ses emplois. Une prononciation ne suffit pas toujours à retrouver ses lettres.','Développer un projet.|Une adresse précise.|Un accueil chaleureux.|La connexion est coupée.'.split('|'),'Écris le mot, cache-le, retrouve-le de mémoire, puis vérifie. Recommence après un délai.')
lesson('ponctuation','orthographe','Ponctuer pour être compris','Donner du rythme sans couper le sens','Le point termine une phrase. La virgule sépare notamment les éléments d’une liste ou encadre certaines précisions. On ne sépare normalement pas le sujet de son verbe par une virgule.','Le soir, je lis.|Lina, ma voisine, écrit un roman.|Les enfants jouent dehors.'.split('|'),'Lis ta phrase à voix haute, puis vérifie la structure : une pause orale n’impose pas toujours une virgule.')
lesson('registre','vocabulaire','Un vocabulaire plus précis','Du courant au soutenu','Le registre soutenu privilégie des mots précis et une syntaxe soignée. Il doit rester naturel et adapté au destinataire. Un mot rare n’améliore pas automatiquement une phrase.','Je vous remercie de votre aide.|Pourriez-vous préciser votre demande ?|Cette proposition mérite un examen attentif.'.split('|'),'Remplace les mots vagues seulement lorsque le nouveau mot précise réellement ton idée.')
lesson('nuances','vocabulaire','Des mots proches, des sens différents','Choisir selon le contexte','Des mots proches ne sont pas toujours interchangeables. « Amener » s’emploie notamment pour une personne ; « apporter » pour une chose. « Compréhensible » signifie facile à comprendre ; « compréhensif » qualifie une personne indulgente.','Apporter un dossier.|Amener un ami.|Un texte compréhensible.|Une personne compréhensive.'.split('|'),'Vérifie le sens dans le contexte, pas seulement la ressemblance des mots.')
lesson('structure','redaction','Une idée, un paragraphe','Organiser pour guider le lecteur','Un paragraphe développe une idée principale, puis l’explique ou l’illustre. Un texte argumentatif présente une position, des arguments et des exemples avant sa conclusion.','Idée : lire enrichit le vocabulaire.|Explication : on rencontre des mots en contexte.|Exemple : un roman révèle des nuances de sens.'.split('|'),'Avant d’écrire, note ton idée principale et un exemple concret pour chaque paragraphe.')
lesson('connecteurs','redaction','Relier les idées','Cause, conséquence et opposition','Les connecteurs expriment une relation logique. « Parce que » introduit une cause. « Donc » marque une conséquence. « Cependant » indique une opposition ou une restriction. « En outre » ajoute un élément.','Il pleut ; nous restons donc ici.|Le trajet est long ; cependant, il est agréable.|Cette solution est simple. En outre, elle est peu coûteuse.'.split('|'),'Choisis d’abord la relation entre les idées, puis le connecteur qui la traduit.')
lesson('clarte','redaction','Relire et reformuler','Une écriture claire et soignée','La relecture vérifie d’abord le sens et l’organisation, puis les phrases, les accords, les temps et l’orthographe. Pour un courriel formel, annonce clairement ta demande et termine avec une formule adaptée.','Je vous écris afin de solliciter un rendez-vous.|Pourriez-vous m’indiquer vos disponibilités ?|Je vous remercie de votre attention.'.split('|'),'Fais plusieurs passages de relecture, chacun avec un objectif : sens, structure, puis langue.')
lesson('lecture','comprehension','Lire entre les lignes','Information, déduction et opinion','Une information explicite est donnée par le texte. Une inférence est une déduction fondée sur des indices. Une opinion exprime un jugement ; elle ne doit pas être confondue avec un fait vérifiable.','« La bibliothèque ouvre à neuf heures » : information.|« Selon moi, ce roman est passionnant » : opinion.'.split('|'),'Appuie ta réponse sur un passage précis. Ne transforme pas une supposition en certitude.')
lesson('nasals','orthographe','On, an, en : écouter et écrire','Les sons nasaux et leurs graphies','On représente souvent le son /ɔ̃/ ; an et en représentent souvent /ɑ̃/. Les accents peuvent faire varier la prononciation. Une même voyelle nasale a plusieurs graphies : chant, champ, vent, temps. La famille du mot et sa graphie exacte restent nécessaires.',['Conjugaison : con · ju · gai · son.','Comparaison, terminaison.','Chanter → chant.','Emporter, chambre ; exception : bonbon.'],'Écoute, cherche une famille, vérifie l’écriture, puis écris le mot de mémoire. Le son ne suffit pas toujours à choisir entre an et en.')
# Homophones: deliberately distinct contexts and explanations.
for p,g,b,e in [
 ('Ils ___ un rendez-vous demain.','ont',['on','en'],'« Ils avaient un rendez-vous » fonctionne : il faut le verbe avoir.'),
 ('___ apprend mieux avec des exemples.','On',['Ont','En'],'« Il apprend mieux » fonctionne : on est le sujet.'),
 ('Les élèves ___ compris la consigne.','ont',['on','en'],'« Les élèves avaient compris » : auxiliaire avoir au pluriel.'),
 ('Demain, ___ commencera une nouvelle leçon.','on',['ont','en'],'Le sujet du verbe commencera est le pronom on.'),
 ('Elles ___ de bonnes idées.','ont',['on','en'],'Elles possèdent des idées : ont est le verbe avoir.'),
 ('Dans ce groupe, ___ s’entraide.','on',['ont','en'],'On est le sujet du verbe pronominal s’entraider.')]: q('homophones','on-ont',1,p,g,b,e)
for p,g,b,e in [
 ('Pour montrer les fleurs, complète : « Regarde ___ fleurs près de la fenêtre. »','ces',['ses','c’est','s’est'],'On montre les fleurs : déterminant démonstratif ces.'),
 ('Pour indiquer la possession : « Lina a oublié ___ clés : elles lui appartiennent. »','ses',['ces','c’est','s’est'],'Les clés appartiennent à Lina : déterminant possessif ses.'),
 ('___ une réponse très claire.','C’est',['Ces','Ses','S’est'],'On peut dire « Cela est une réponse très claire ».'),
 ('Il ___ trompé de chemin.','s’est',['c’est','ses','ces'],'Se tromper est un verbe pronominal : il s’est trompé.'),
 ('Pour indiquer que les affaires lui appartiennent : « Elle protège ___ affaires personnelles. »','ses',['ces','s’est','c’est'],'Affaires personnelles indique ici la possession.'),
 ('Pour montrer les arbres : « ___ arbres-là ont été plantés hier. »','Ces',['Ses','C’est','S’est'],'Le suffixe -là désigne les arbres : ces.'),
 ('Ma sœur ___ inscrite à un atelier.','s’est',['c’est','ses','ces'],'S’inscrire est pronominal : elle s’est inscrite.'),
 ('___ agréable de progresser.','C’est',['S’est','Ces','Ses'],'« Cela est agréable » confirme c’est.')]: q('homophones','ces-ses',1,p,g,b,e)
for p,g,b,e in [
 ('Elle ___ un livre à rendre.','a',['à','as'],'On peut dire « elle avait un livre » : a.'),
 ('Nous allons ___ la bibliothèque.','à',['a','as'],'À introduit un lieu ; « avait » ne convient pas.'),
 ('Ce texte ___ intéressant.','est',['et','es'],'« Ce texte était intéressant » : verbe être.'),
 ('Il lit ___ prend des notes.','et',['est','es'],'Et relie les deux actions.'),
 ('Les exercices ___ terminés.','sont',['son','sons'],'« Les exercices étaient terminés » : sont.'),
 ('Elle ouvre ___ cahier.','son',['sont','sons'],'Son accompagne le nom cahier et indique la possession.'),
 ('___ habites-tu ?','Où',['Ou','Oû'],'La question porte sur le lieu : où.'),
 ('Tu préfères lire ___ écrire ?','ou',['où','oû'],'On propose un choix : lire ou bien écrire.')]: q('homophones','a-et-son',1,p,g,b,e)
for p,g,b,e in [
 ('Elle ___ souvient de la règle.','se',['ce','ses'],'Se souvenir est un verbe pronominal.'),
 ('___ chapitre est très utile.','Ce',['Se','Ses'],'Ce accompagne le nom masculin chapitre.'),
 ('Je ___ explique la consigne.','leur',['leurs','leures'],'Devant le verbe, leur est un pronom invariable.'),
 ('Ils ont rangé ___ chaussures.','leurs',['leur','leures'],'Devant le nom pluriel chaussures, on écrit leurs.'),
 ('___ que tu dis est juste.','Ce',['Se','Ses'],'Ce est ici un pronom démonstratif : ce que tu dis.'),
 ('Les enfants parlent à ___ mère.','leur',['leurs','leures'],'Le nom mère est au singulier : leur mère.')]: q('homophones','ce-se',2,p,g,b,e)
for p,g,b,e in [
 ('Du café ? Oui, j’___ veux.','en',['on','ont'],'En remplace « du café ».'),
 ('___ part demain matin.','On',['En','Ont'],'On est le sujet de part.'),
 ('Nous voyageons ___ train.','en',['on','ont'],'En introduit ici le moyen de transport.'),
 ('___ en reparlera plus tard.','On',['En','Ont'],'On est le sujet ; en remplace le sujet de conversation.')]: q('homophones','en-on',1,p,g,b,e)
for p,g,b,e in [
 ('___ arbre est immense.','Cet',['Ce','Cette','Ces'],'Arbre est masculin singulier et commence par une voyelle.'),
 ('___ histoire est captivante.','Cette',['Cet','Ce','Ces'],'Histoire est féminin singulier : cette.'),
 ('___ livre me plaît.','Ce',['Cet','Cette','Ces'],'Livre est masculin singulier et commence par une consonne.'),
 ('___ élèves sont attentifs.','Ces',['Cet','Ce','Cette'],'Élèves est au pluriel : ces.'),
 ('___ homme écrit un roman.','Cet',['Ce','Cette','Ces'],'Homme est masculin et commence par un h muet.'),
 ('___ héros est courageux.','Ce',['Cet','Cette','Ces'],'Le h de héros est aspiré : ce héros.'),
 ('___ excellente idée mérite d’être retenue.','Cette',['Cet','Ce','Ces'],'Idée est féminin ; excellente reste au féminin : cette.'),
 ('___ excellent conseil m’aide.','Cet',['Ce','Cette','Ces'],'Conseil est masculin ; le mot immédiatement suivant, excellent, commence par une voyelle.')]: q('grammaire','determinants',1,p,g,b,e)
for p,g,b,e in [
 ('Les petites filles sont ___.','heureuses',['heureux','heureuse'],'L’adjectif s’accorde avec filles : féminin pluriel.'),
 ('Les enfants du voisin ___.','jouent',['joue','joues'],'Le sujet est les enfants, pas le voisin.'),
 ('Une réponse ___ et précise.','claire',['clair','clairs'],'Réponse est féminin singulier : claire.'),
 ('Des maisons ___.','blanches',['blanc','blanche'],'Maisons est féminin pluriel : blanches.'),
 ('Le groupe de visiteurs ___ demain.','arrive',['arrivent','arrives'],'Le sujet grammatical est le groupe, singulier.'),
 ('Toi et moi ___ régulièrement.','écrivons',['écrivent','écrivez'],'Toi et moi correspond à nous : écrivons.')]: q('grammaire','accords',2,p,g,b,e)
for p,g,b,e in [
 ('Elles sont ___ tôt.','arrivées',['arrivé','arrivés'],'Avec être, arrivée s’accorde avec elles : arrivées.'),
 ('Les lettres qu’elle a ___ sont longues.','écrites',['écrit','écrite'],'Le COD les lettres est placé avant avoir : écrites.'),
 ('Elle a ___ trois lettres.','écrit',['écrites','écrite'],'Le COD trois lettres est après le verbe : écrit reste invariable.'),
 ('Les livres que j’ai ___ sont passionnants.','lus',['lu','lues'],'Livres est le COD placé avant avoir : masculin pluriel, lus.'),
 ('Elles se sont ___ au téléphone.','parlé',['parlées','parlés'],'On parle à quelqu’un : se est indirect, donc parlé ne s’accorde pas.'),
 ('La porte est ___.','fermée',['fermé','fermés'],'Porte est féminin singulier : fermée.')]: q('grammaire','participes',3,p,g,b,e)
for p,g,b,e in [
 ('Choisis la phrase du français standard écrit.','Je ne sais pas.',['Je sais pas.','Je ne sait pas.'],'La négation écrite standard comporte ne et pas ; avec je, on écrit sais.'),
 ('C’est le sujet ___ je parle.','dont',['que','où'],'On parle de quelque chose : dont remplace de ce sujet.'),
 ('Choisis la construction correcte.','Malgré la pluie, nous sortons.',['Malgré qu’il pleut, nous sortons.','Malgré de la pluie, nous sortons.'],'Malgré est une préposition suivie ici d’un groupe nominal.'),
 ('Après qu’il ___ parti, nous avons rangé.','est',['soit','serait'],'Après que introduit normalement l’indicatif ; le fait est accompli.'),
 ('Choisis la phrase correcte.','Je me souviens de cette règle.',['Je me rappelle de cette règle.','Je me souviens cette règle.'],'Se souvenir se construit avec de ; se rappeler se construit directement avec un COD.')]: q('grammaire','phrases',3,p,g,b,e)
for p,g,b,e in [
 ('Tu ___ ton exercice.','finis',['finit','finie'],'Finir au présent avec tu : finis.'),
 ('Vous ___ attention.','faites',['faisez','font'],'Faire au présent avec vous : faites.'),
 ('Nous ___ le temps de relire.','prenons',['prennons','prendons'],'Prendre au présent avec nous : prenons, un seul n.'),
 ('Ils ___ une lettre.','écrivent',['écrive','écriventent'],'Écrire au présent avec ils : écrivent.'),
 ('Vous ___ la vérité.','dites',['disez','dit'],'Dire au présent avec vous : dites.'),
 ('Je ___ les instructions.','suis',['suit','suie'],'Suivre au présent avec je : suis.'),
 ('Nous ___ notre travail.','commençons',['commencons','commançons'],'La cédille garde le son /s/ devant o : commençons.'),
 ('Au présent : « Nous ___ ensemble. »','mangeons',['mangons','mangions'],'Au présent, le e garde le son doux du g devant o : mangeons.')]: q('conjugaison','present',1,p,g,b,e)
for p,g,b,e in [
 ('Pour décrire une habitude à l’imparfait : « Autrefois, chaque soir, nous ___ ensemble. »','lisions',['avons lu','lirez'],'Chaque soir décrit une habitude passée : imparfait.'),
 ('Au passé composé : « Hier, elle ___ sa rédaction en une heure. »','a terminé',['terminera','termine'],'Hier et le résultat achevé appellent ici le passé composé.'),
 ('Quand elle est arrivée, j’___ déjà fini.','avais',['ai','aurai'],'Le fait de finir précède l’arrivée : plus-que-parfait, avais fini.'),
 ('Pendant que je lisais, le téléphone ___.','a sonné',['sonnera','sonne'],'Le passé composé présente l’événement qui survient pendant l’action à l’imparfait.')]: q('conjugaison','temps',2,p,g,b,e)
for p,g,b,e in [
 ('Pour annoncer un fait au futur : « Demain, je ___ disponible. »','serai',['serais','serait'],'Un fait annoncé pour demain : futur, je serai.'),
 ('Si j’avais le temps, je ___ davantage.','lirais',['lirai','lis'],'Si + imparfait, puis conditionnel : je lirais.'),
 ('Il faut que tu ___ attentif.','sois',['es','seras'],'Il faut que appelle le subjonctif : tu sois.'),
 ('Pourriez-vous me ___ ce mot ?','expliquer',['expliquez','expliqué'],'Après pourriez, le second verbe est à l’infinitif.'),
 ('Si tu viens demain, nous ___ ensemble.','travaillerons',['travaillerions','travaillerait'],'Si + présent peut annoncer une condition future : nous travaillerons.'),
 ('Bien qu’il ___ fatigué, il continue.','soit',['est','sera'],'Bien que appelle le subjonctif : soit.'),
 ('Je ___ vous demander un renseignement.','souhaiterais',['souhaiterait','souhaiterez'],'Le conditionnel avec je permet une demande polie : souhaiterais.')]: q('conjugaison','modes',3,p,g,b,e)
for p,g,b,e in [
 ('Choisis l’orthographe correcte.','élève',['éleve','èléve'],'Élève porte un accent aigu sur le premier e et un accent grave sur le deuxième.'),
 ('Complète : ___ bientôt !','À',['A','Â'],'À est une préposition ; la majuscule conserve son accent.'),
 ('Il a ___ annuler son voyage.','dû',['du','dù'],'Le participe passé masculin singulier de devoir est dû.'),
 ('Quelle phrase distingue correctement le lieu du choix ?','Où vas-tu : au parc ou au musée ?',['Ou vas-tu : au parc où au musée ?','Où vas-tu : au parc où au musée ?'],'Où interroge sur le lieu ; ou exprime le choix.'),
 ('Choisis une graphie correcte.','événement',['évenement','évènemant'],'Événement est correct ; évènement est également admis.'),
 ('Choisis l’orthographe correcte.','français',['francais','françai'],'La cédille de français permet le son /s/ devant a.')]: q('orthographe','accents',1,p,g,b,e)
for g,b,e in [
 ('développer',['déveloper','dévelloper'],'Développer comporte un seul l et deux p.'),
 ('accueil',['acceuil','aceuil'],'Accueil s’écrit avec deux c, puis u-e-i-l.'),
 ('adresse',['addresse','adrese'],'Adresse comporte un seul d et deux s.'),
 ('connexion',['connection','connecxion'],'Le nom français connexion s’écrit avec un x.'),
 ('langage',['language','langague'],'Langage ne comporte pas de u après le g.'),
 ('indépendant',['indépandant','indéppendant'],'Indépendant appartient à la famille de dépendre.'),
 ('professionnel',['professionel','profesionnel'],'Professionnel comporte deux s et deux n.'),
 ('davantage',['d’avantage','daventage'],'Dans le sens de « plus », davantage s’écrit en un mot.')]: q('orthographe','mots',2,'Pour exprimer « plus », quelle forme faut-il écrire ?' if g=='davantage' else 'Choisis le mot correctement écrit.',g,b,e)
for p,g,b,e in [
 ('Choisis la ponctuation la plus adaptée.','Les enfants jouent dehors.',['Les enfants, jouent dehors.','Les, enfants jouent dehors.'],'On ne sépare pas le sujet les enfants du verbe jouent.'),
 ('Choisis la phrase correctement ponctuée.','Lina, ma voisine, écrit un roman.',['Lina ma voisine, écrit un roman.','Lina, ma voisine écrit, un roman.'],'La précision ma voisine est encadrée par deux virgules.'),
 ('Comment terminer une question directe ?','Avec un point d’interrogation.',['Avec une virgule.','Toujours avec deux points.'],'Une question directe se termine par un point d’interrogation.')]: q('orthographe','ponctuation',2,p,g,b,e)
for p,g,b,e in [
 ('Quel début convient à une demande formelle ?','Je vous écris afin de solliciter un rendez-vous.',['Salut, faut qu’on se voie.','Je veux un rendez-vous, vite.'],'Solliciter et le vouvoiement conviennent à une demande formelle.'),
 ('Remplace « C’est un truc important » par une phrase précise.','C’est un enjeu important.',['C’est une chose de truc.','C’est un machin conséquent.'],'Enjeu précise la nature de ce qui importe ; truc et machin sont vagues.'),
 ('Quel mot correspond à « qui dure peu de temps » ?','Éphémère',['Éternel','Fréquent'],'Éphémère signifie de courte durée.'),
 ('Quel mot signifie « remettre à plus tard » ?','Différer',['Affirmer','Achever'],'Différer une décision signifie la reporter.'),
 ('Quelle formulation est la plus adaptée à un courriel professionnel ?','Pourriez-vous préciser votre demande ?',['Tu peux être plus clair ?','Dis-moi ce que tu veux.'],'La formulation avec pourriez-vous est polie et précise.'),
 ('Que signifie « pertinent » ?','Adapté au sujet et utile.',['Très compliqué.','Toujours rare.'],'Un argument pertinent est approprié à la question traitée.')]: q('vocabulaire','registre',2,p,g,b,e)
for p,g,b,e in [
 ('Je vais ___ ce dossier à la réunion.','apporter',['amener','emmener'],'On apporte une chose, ici un dossier.'),
 ('Ce texte est facile à comprendre : il est ___.','compréhensible',['compréhensif','compréhensivement'],'Compréhensible qualifie ce qu’on peut comprendre.'),
 ('Elle écoute sans juger : elle est ___.','compréhensive',['compréhensible','comprise'],'Compréhensive qualifie une personne qui fait preuve de compréhension.'),
 ('Une ___ désigne ici une hypothèse fondée sur des indices.','conjecture',['conjoncture','conjugaison'],'Conjecture signifie supposition ; conjoncture désigne une situation.'),
 ('Son exposé est court et va à l’essentiel : il est ___.','concis',['confus','exhaustif'],'Concis signifie bref et précis ; exhaustif signifie complet.')]: q('vocabulaire','nuances',3,p,g,b,e)
for p,g,b,e in [
 ('Que doit développer principalement un paragraphe ?','Une idée principale, expliquée ou illustrée.',['Toutes les idées sans ordre.','Seulement une liste de mots.'],'Un paragraphe cohérent se construit autour d’une idée principale.'),
 ('Quel ordre convient à un court texte argumentatif ?','Position, arguments et exemples, conclusion.',['Conclusion, mots isolés, salutations.','Exemples sans idée, puis titre.'],'L’ordre permet au lecteur de comprendre la position et les raisons qui la soutiennent.'),
 ('Quel exemple soutient « la lecture enrichit le vocabulaire » ?','Un roman permet de découvrir des mots en contexte.',['Les livres sont parfois lourds.','La bibliothèque ferme à dix-huit heures.'],'L’exemple explique directement comment la lecture enrichit le vocabulaire.'),
 ('Avant de rédiger, quelle action est utile ?','Définir le destinataire, l’objectif et le plan.',['Choisir uniquement des mots rares.','Écrire la conclusion sans connaître le sujet.'],'L’objectif et le destinataire guident le contenu et le registre.')]: q('redaction','structure',1,p,g,b,e)
for p,g,b,e in [
 ('Il pleut ; nous restons ___ à la maison.','donc',['cependant','pourtant'],'Rester est la conséquence de la pluie : donc.'),
 ('Le trajet est long ; ___, il reste agréable.','cependant',['donc','parce que'],'On introduit une restriction au caractère long du trajet.'),
 ('Elle progresse ___ elle s’entraîne régulièrement.','parce qu’',['donc qu’','cependant qu’'],'L’entraînement est présenté comme la cause du progrès.'),
 ('Cette méthode est simple. ___, elle coûte peu.','En outre',['Pourtant','À cause de'],'On ajoute un deuxième avantage : en outre.'),
 ('Quel connecteur annonce une conclusion ?','En conclusion',['Par exemple','D’une part'],'En conclusion annonce la synthèse finale.')]: q('redaction','connecteurs',2,p,g,b,e)
for p,g,b,e in [
 ('Quelle phrase est la plus concise ?','Je vous remercie de votre aide.',['Je vous remercie pour l’aide que vous m’avez aidé à obtenir en m’aidant.','Merci de l’aide aidante.'],'La première formulation est claire et évite les répétitions.'),
 ('Que vérifier en premier lors d’une relecture ?','La clarté des idées et leur organisation.',['La présence de mots rares.','Seulement la longueur du titre.'],'Corriger le fond d’abord évite de polir des phrases qu’il faudra ensuite réécrire.'),
 ('Quel objet de courriel est le plus informatif ?','Demande de rendez-vous — inscription à l’atelier',['Bonjour','Urgent !!!'],'L’objet indique directement le but du message.'),
 ('Quelle reformulation évite une répétition ?','Ce livre est instructif et agréable à lire.',['Ce livre est un livre instructif, ce livre est agréable.','Le livre livre de l’instruction.'],'La phrase rassemble deux qualités sans répéter livre.')]: q('redaction','clarte',3,p,g,b,e)
texts=[
 ('La bibliothèque ouvre à neuf heures. Lina arrive à huit heures cinquante et attend devant la porte.','Pourquoi Lina attend-elle ?','La bibliothèque n’est pas encore ouverte.',['Elle a oublié son livre.','La bibliothèque est fermée toute la journée.'],'Lina arrive dix minutes avant l’ouverture annoncée.'),
 ('Malik emporte un parapluie. Le ciel est sombre et les premières gouttes tombent.','Quelle déduction est appuyée par le texte ?','Malik se prépare à la pluie.',['Malik part forcément en vacances.','Malik a peur de tous les nuages.'],'Le parapluie et les gouttes sont des indices de pluie ; les autres réponses ajoutent des informations.'),
 ('Selon moi, ce roman est le meilleur de l’année. Il compte trois cents pages.','Quelle proposition exprime une opinion ?','Ce roman est le meilleur de l’année.',['Il compte trois cents pages.','Le texte parle d’un roman.'],'Meilleur exprime un jugement ; le nombre de pages est vérifiable.'),
 ('L’atelier est gratuit, mais l’inscription est obligatoire avant vendredi.','Que faut-il faire pour participer ?','S’inscrire avant vendredi.',['Payer vendredi.','Venir sans inscription.'],'La gratuité ne supprime pas l’obligation d’inscription.'),
 ('Bien que les transports soient perturbés, la réunion est maintenue.','Que signifie cette phrase ?','La réunion aura lieu malgré les perturbations.',['La réunion est annulée.','Les transports fonctionnent normalement.'],'Bien que marque une concession ; maintenue signifie qu’elle reste prévue.'),
 ('Le jardin a rouvert après six mois de travaux. Les allées sont accessibles aux fauteuils roulants.','Quelle information est explicitement donnée ?','Les allées sont accessibles aux fauteuils roulants.',['Tous les visiteurs possèdent un fauteuil.','Les travaux ont coûté un million.'],'L’accessibilité est écrite dans le texte ; le coût ne l’est pas.'),
 ('Nora voulait sortir. Pourtant, elle est restée chez elle pour terminer son dossier.','Quel rapport exprime « pourtant » ?','Une opposition entre son souhait et son action.',['Une addition de deux sorties.','Une chronologie de deux voyages.'],'Elle souhaitait sortir, mais son action est différente.'),
 ('Une association propose de prolonger les horaires de la bibliothèque. Ses membres estiment que les salariés pourraient ainsi lire après leur journée de travail.','Quel argument soutient la proposition ?','Des horaires prolongés faciliteraient la venue des salariés.',['Les livres seraient tous gratuits.','Les salariés travailleraient moins.'],'Le texte relie les horaires à la disponibilité après le travail, sans annoncer les autres effets.')]
for i,(t,p,g,b,e) in enumerate(texts): q('comprehension','lecture',1 if i<4 else 3,t+'\n\n'+p,g,b,e)
# Tables verified for frequent verbs: practice each person across three useful tenses.
paradigms = [
 ('travailler','avec soin', ['travaille','travailles','travaille','travaillons','travaillez','travaillent'], ['travaillais','travaillais','travaillait','travaillions','travailliez','travaillaient'], ['travaillerai','travailleras','travaillera','travaillerons','travaillerez','travailleront']),
 ('parler','avec clarté', ['parle','parles','parle','parlons','parlez','parlent'], ['parlais','parlais','parlait','parlions','parliez','parlaient'], ['parlerai','parleras','parlera','parlerons','parlerez','parleront']),
 ('aimer','les livres', ['aime','aimes','aime','aimons','aimez','aiment'], ['aimais','aimais','aimait','aimions','aimiez','aimaient'], ['aimerai','aimeras','aimera','aimerons','aimerez','aimeront']),
 ('finir','cet exercice', ['finis','finis','finit','finissons','finissez','finissent'], ['finissais','finissais','finissait','finissions','finissiez','finissaient'], ['finirai','finiras','finira','finirons','finirez','finiront']),
 ('choisir','un livre', ['choisis','choisis','choisit','choisissons','choisissez','choisissent'], ['choisissais','choisissais','choisissait','choisissions','choisissiez','choisissaient'], ['choisirai','choisiras','choisira','choisirons','choisirez','choisiront']),
 ('apprendre','une règle', ['apprends','apprends','apprend','apprenons','apprenez','apprennent'], ['apprenais','apprenais','apprenait','apprenions','appreniez','apprenaient'], ['apprendrai','apprendras','apprendra','apprendrons','apprendrez','apprendront']),
 ('écrire','une phrase', ['écris','écris','écrit','écrivons','écrivez','écrivent'], ['écrivais','écrivais','écrivait','écrivions','écriviez','écrivaient'], ['écrirai','écriras','écrira','écrirons','écrirez','écriront']),
 ('lire','ce texte', ['lis','lis','lit','lisons','lisez','lisent'], ['lisais','lisais','lisait','lisions','lisiez','lisaient'], ['lirai','liras','lira','lirons','lirez','liront']),
 ('prendre','des notes', ['prends','prends','prend','prenons','prenez','prennent'], ['prenais','prenais','prenait','prenions','preniez','prenaient'], ['prendrai','prendras','prendra','prendrons','prendrez','prendront']),
 ('faire','des progrès', ['fais','fais','fait','faisons','faites','font'], ['faisais','faisais','faisait','faisions','faisiez','faisaient'], ['ferai','feras','fera','ferons','ferez','feront']),
 ('comprendre','la consigne', ['comprends','comprends','comprend','comprenons','comprenez','comprennent'], ['comprenais','comprenais','comprenait','comprenions','compreniez','comprenaient'], ['comprendrai','comprendras','comprendra','comprendrons','comprendrez','comprendront']),
 ('relire','la réponse', ['relis','relis','relit','relisons','relisez','relisent'], ['relisais','relisais','relisait','relisions','relisiez','relisaient'], ['relirai','reliras','relira','relirons','relirez','reliront'])
]
for infinitive,complement,present,imparfait,futur in paradigms:
 for tense,forms,lid,level in [('présent',present,'present',1),('imparfait',imparfait,'temps',2),('futur simple',futur,'modes',2)]:
  for person,form in zip(['Je','Tu','Elle','Nous','Vous','Ils'],forms):
   pronoun='J’' if person=='Je' and form[0] in 'aeioué' else person+' '
   choices=list(dict.fromkeys(f for f in forms if f!=form))[:2]
   prompt=f'Complète au {tense} : « {pronoun}___ {complement}. » ({infinitive})'
   explanation=f'Au {tense}, {infinitive} avec le sujet « {person.lower()} » se conjugue « {form} ». La phrase complète est : « {pronoun}{form} {complement}. »'
   q('conjugaison',lid,level,prompt,form,choices,explanation)
for good,bad,explanation in [
 ('conjugaison',['conjugaisan','conjuguaison'],'Conjugaison se termine par -aison, comme comparaison et terminaison.'),
 ('comparaison',['comparaisan','comparession'],'Comparaison appartient à la famille de comparer et se termine par -aison.'),
 ('terminaison',['terminaisan','terminéson'],'Terminaison se termine par -aison ; c’est le son nasal de on.'),
 ('enfant',['anfant','enfon'],'Enfant contient deux graphies du son /ɑ̃/ : en et an.'),
 ('chanson',['chansan','chenson'],'Chanson commence par chan et se termine par son. La famille chanter aide à retenir le début.'),
 ('emporter',['enporter','amporter'],'Devant p, on écrit généralement m : emporter, de la famille de porter.'),
 ('chambre',['chanbre','chembre'],'Devant b, on écrit généralement m : chambre.'),
 ('bonbon',['bombon','bonban'],'Bonbon est une exception à la règle du m devant b.'),
 ('temps',['tamps','tens'],'Temps s’écrit avec em et se termine par ps ; il faut mémoriser le mot.'),
 ('chant',['chent','chont'],'Chanter aide à retenir chant et le t final.')
]: q('orthographe','nasals',1,'Choisis la graphie correcte du mot.',good,bad,explanation)
Path('src/content/lessons.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2))
Path('src/content/questions.json').write_text(json.dumps(questions,ensure_ascii=False,indent=2))
print(f'{len(lessons)} leçons ; {len(questions)} questions originales')
