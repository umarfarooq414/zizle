import React from 'react';
import styled from './style.module.css';
import DataTermImPrints from '../../components/dataTermImPrint/DataTermImPrints';
import DataTermImPrintsFooter from '../../components/dataTermImPrintFooter/DataTermImPrintsFooter';
const DataProtection = () => {
  return (
    <div>
      <DataTermImPrints />
      <div className={styled.contentBody}>
        <div className={styled.container}>
          <h1 class=' text-3xl font-bold mb-4 dark:text-white'>Datenschutz</h1>
          <div class='dark:text-white'>
            <div>
              <div>
                <main>
                  <div>
                    <h2>EINLEITUNG</h2>
                    <p>
                      <b>
                        Willkommen in der Liebevalo-Community! Bei Liebevalo sind uns Ihre
                        Privatsphäre und Ihr Vertrauen wichtig, deshalb teilen wir Ihnen in diesen
                        Datenschutzrichtlinien (den „Richtlinien“) mit, wie wir mit Ihren Daten
                        umgehen, an wen wir sie weitergeben und welche Rechte Sie im Hinblick auf
                        die Daten haben. Diese Richtlinien gelten, wenn Sie unsere Dienste über
                        unsere Websites, die mit diesen Richtlinien verknüpft sind, nutzen, aber
                        auch unsere Produkte und Anwendungen (darunter Liebevalo mobile Anwendungen,
                        herunterladbare Produkte und Anwendungen sowie Seiten, die von Liebevalo auf
                        sozialen Netzwerken und anderen Plattformen betrieben werden)
                      </b>
                      Wir, die JOOZ YAZILIM BİLİŞİM TEKNOLOJİLERİ DANIŞMANLIK VE TİCARET LİMİTED
                      ŞİRKETİ YENİGÜN MAH. MEVLANA CAD. B BLOK NO:54 B/203 – MURATPAŞA / ANTALYA /
                      TÜRKİYE, eMail:info@liebevalo.de, nehmen den Schutz Ihrer personenbezogenen
                      Daten sehr ernst und halten uns streng an alle geltenden Gesetze und
                      Vorschriften zum Datenschutz, insbesondere an die Datenschutzgrundverordnung,
                      (DSGVO), das Bundesdatenschutzgesetz (BDSG) und das Telemediengesetz (TMG).
                      Die folgenden Erläuterungen geben Ihnen einen Überblick darüber, wie wir
                      diesen Schutz sicherstellen und welche Daten wir zu welchem Zweck verarbeiten.
                    </p>
                    <p>
                      <strong>1. Nutzungsdaten</strong>
                    </p>
                    <p>
                      Bei jedem Zugriff auf unsere Webseite und bei jedem Abruf einer Datei, werden
                      automatisch über diesen Vorgang allgemeine Daten in einer Protokolldatei
                      gespeichert. Die Speicherung dient ausschließlich systembezogenen und
                      statistischen Zwecken (auf Grundlage von Art. 6 Abs. 1 Buchst. b) DSGVO),
                      sowie in Ausnahmefällen zur Anzeige von Straftaten (auf Grundlage von Art. 6
                      Abs. 1 Buchst. e) DSGVO). Eine Weitergabe der Daten an Dritte oder eine
                      sonstige Auswertung findet nicht statt, es sei denn, es besteht eine
                      gesetzliche Verpflichtung dazu (Art. 6 Abs. 1 Buchst. e) DSGVO). Im Einzelnen
                      wird über jeden Abruf folgender Datensatz gespeichert:
                    </p>
                    <ul>
                      <li> Name der abgerufenen Datei</li>
                      <li> Datum und Uhrzeit des Abrufs</li>
                      <li> übertragene Datenmenge</li>
                      <li> Meldung, ob der Abruf erfolgreich war</li>
                      <li> Beschreibung des Typs des verwendeten Webbrowsers</li>
                      <li> verwendetes Betriebssystem</li>
                      <li> die zuvor besuchte Seite</li>
                      <li> Provider</li>
                      <li> IP-Adresse des Nutzers</li>
                    </ul>
                    <p>
                      <strong>2. Personenbezogene Daten</strong>
                    </p>
                    <p>
                      Personenbezogene Daten werden von uns nur dann verarbeitet, wenn uns dies
                      gesetzlich gestattet ist, oder Sie uns Ihre Einwilligung erteilt haben. Im
                      Einzelnen:
                    </p>
                    <ul>
                      <li>
                        {' '}
                        a) Kontakt
                        <ul>
                          <li>
                            Wenn Sie mit uns in Kontakt treten, speichern wir Ihre Daten auf
                            Grundlage von Art. 6 Abs. 1 Buchst. b) DSGVO zum Zwecke der Bearbeitung
                            Ihrer Anfrage, sowie für den Fall, dass eine weitere Korrespondenz
                            stattfinden sollte. Alle Daten werden nach vollständiger Bearbeitung
                            Ihres Anliegens gelöscht. Ausgenommen hiervon sind Daten, für die
                            gesetzliche oder anderweitig vorgeschriebene Aufbewahrungspflichten
                            bestehen.
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul>
                      <li>
                        {' '}
                        b) Registrierung
                        <ul>
                          <li>
                            Wir erheben im Rahmen des Registrierungsprozesses die folgenden Daten:
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <ul>
                      <li>Nickname</li>
                      <li>Passwort</li>
                      <li>eMail-Adresse</li>
                      <li>Geburtsdatum</li>
                      <li>Land</li>
                      <li>PLZ</li>
                      <li>Eigenes Geschlecht</li>
                      <li>Geschlecht der gewünschten Kontakte</li>
                    </ul>
                    <p>
                      Ihre Registrierung kann nur abgeschlossen und an uns übermittelt werden, wenn
                      Sie unsere Allgemeinen Geschäftsbedingungen und diese Datenschutzbestimmungen
                      akzeptiert und so in Ihre Erklärung mit aufgenommen haben. Nach dem Absenden
                      dieser Daten erhalten Sie von uns eine eMail an die von Ihnen angegebene
                      eMail-Adresse, in der Sie zur Verifizierung der von Ihnen angegebenen
                      eMailAdresse einen Bestätigungslink anklicken müssen. Rechtsgrundlage für
                      diese Datenverarbeitung ist Art. 6 Abs. 1 Buchst. b) DSGVO, bzw. mit Abschluss
                      Ihrer Registrierung Ihre Einwilligung und damit Art. 6 Abs. 1 Buchst. a)
                      DSGVO).
                    </p>
                    <ul>
                      <li> Zahlungsdienstleister</li>
                    </ul>
                    <ul>
                      <li>
                        Beim Kauf von Flirtchips werden Sie zur Zahlungsabwicklung zu Paypal
                        weitergeleitet
                      </li>
                    </ul>
                    <p>
                      Paypal ist ein Unternehmen der PayPal (Europe) S.àr.l. et Cie, S.C.A.22-24
                      Boulevard Royal, L-2449 Luxembourg. Ihre personenbezogenen Daten werden
                      ausschließlich zum Zwecke der Vertragsabwicklung an den an der
                      Vertragsabwicklung beteiligten Zahlungsdienstleister Paypal weitergegeben. Die
                      Datenweitergabe beschränkt sich hierbei auf die für die Zahlungsabwicklung
                      notwendigen Daten (bspw. Transaktionsreferenzen wie Kundennummer oder
                      Rechnungsnummer). Rechtsgrundlage für diese Datenverarbeitung ist Art. 6 Abs.
                      1 Buchst. b) DSGVO, bzw. Ihre Einwilligung und damit Art. 6 Abs. 1 Buchst. a)
                      DSGVO). Details zum Datenschutz bei Paypal finden Sie unter:
                      <a href='https://www.liebevalo.de/documents/datenschutz'>
                        https://www.paypal.com/de/cgibin/marketingweb?cmd=p/gen/ua/policy_privacy-outside
                      </a>
                      Nach vollständiger Abwicklung des Vertrages werden Ihre Daten für die weitere
                      Verwendung gesperrt und nach Ablauf der steuer- und handelsrechtlichen
                      Aufbewahrungsfristen gelöscht, sofern Sie nicht ausdrücklich in eine weitere
                      Nutzung Ihrer Daten eingewilligt haben.
                    </p>
                    <p>
                      <strong>3. Nutzungsdaten</strong>
                    </p>
                    <ul>
                      <li>
                        a) Chatfunktion Damit andere Teilnehmer über unsere Chatfunktion mit Ihnen
                        in Kontakt treten können, werden Ihre folgenden Daten anderen Teilnehmern
                        zugänglich gemacht:Nickname Alter Weitere personenbezogene Daten (wie z. B.
                        ein eigenes Profilbild) können Sie über Ihr Profil anderen Teilnehmern
                        zugänglich machen. Rechtsgrundlage für diese Datenverarbeitung ist Art. 6
                        Abs. 1 Buchst. b) DSGVO, bzw. hinsichtlich der von Ihnen ggf. weiter
                        zugänglich gemachten personenbezogener Daten Ihre Einwilligung und damit
                        Art. 6 Abs. 1 Buchst. a) DSGVO).
                      </li>
                      <li>
                        b) Chatnachrichten Nachrichten, die über die Chatfunktion versendet werden,
                        werden durch uns für die Dauer Ihrer Mitgliedschaft gespeichert.
                      </li>
                      <li>
                        Identitätsnachweis Sollten wir von Ihnen einen Identitätsnachweis (z.B.
                        Kopie des Ausweispapiers) fordern, wird dieser ausschließlich zu
                        Identifizierungszwecken verwendet und unmittelbar im Anschluss gelöscht.
                        Rechtsgrundlage für diese Datenverarbeitung ist Art. 6 Abs. 1 Buchst. b)
                        DSGVO. Daten, die nicht zur Identifizierung benötigt werden (wie z.B. die
                        auf dem Ausweis aufgedruckte Zugangs- und Seriennummer) dürfen von Ihnen auf
                        der Kopie selbstverständlich geschwärzt werden.
                      </li>
                    </ul>
                    <p>
                      <strong>4. Cookies</strong>
                    </p>
                    <p>
                      Um den Besuch unserer Webseite attraktiv zu gestalten und die Nutzung
                      bestimmter Funktionen zu ermöglichen, verwenden wir auf verschiedenen Seiten
                      sogenannte Cookies. Durch solche Dateielemente kann Ihr Computer als
                      technische Einheit während Ihres Besuchs auf dieser Webseite identifiziert
                      werden, um Ihnen die Verwendung unseres Angebotes – auch bei
                      Wiederholungsbesuchen – zu erleichtern. Sie haben aber in der Regel die
                      Möglichkeit Ihren Internetbrowser so einzustellen, dass Sie über das Auftreten
                      von Cookies informiert werden, so dass Sie diese zulassen oder ausschließen,
                      beziehungsweise bereits vorhandene Cookies löschen können. Bitte verwenden Sie
                      die Hilfefunktion Ihres Internetbrowsers, um Informationen zu der Änderung
                      dieser Einstellungen zu erlangen. Einige Webseiten - so auch unsere - können
                      jedoch ohne Cookies nicht richtig genutzt werden, da diese Dateien für
                      bestimmte Abläufe, wie beispielsweise die Chatfunktion, benötigt werden.Wir
                      weisen Sie daher darauf hin, dass einzelne Funktionen unserer Webseite nicht
                      funktionieren können, wenn Sie die Verwendung von Cookies deaktiviert haben.
                      Cookies erlauben nicht, dass ein Server private Daten von Ihrem Computer oder
                      die von einem anderen Server abgelegten Daten lesen kann. Sie richten auf
                      Ihrem Rechner keinen Schaden an und enthalten keine Viren. Wir stützen den
                      Einsatz von Cookies auf Art. 6 Abs. 1 Buchst. f) DSGVO: die Verarbeitung
                      erfolgt zur Verbesserung der Funktionsweise unserer Webseite. Sie ist daher
                      zur Wahrung unserer berechtigten Interessen erforderlich.
                    </p>
                    <p>
                      <strong>5. Webanalyse mit Google Analytics</strong>
                    </p>
                    <p>
                      Wir benutzen Google Analytics, einen Webanalysedienst der Google Inc., 1600
                      AmphitheatreParkway, Mountain View, CA 94043, USA. Google Analytics verwendet
                      sog. „Cookies", Textdateien, die auf Ihrem Computer gespeichert werden und die
                      eine Analyse der Benutzung der Website durch sie ermöglichen. Die durch den
                      Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in
                      der Regel an einen Server von Google in den USA übertragen und dort
                      gespeichert. Im Falle der Aktivierung der IP-Anonymisierung auf dieser
                      Webseite, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten
                      der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den
                      Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die
                      volle IP-Adresse an einen Server von Google in den USA übertragen und dort
                      gekürzt. Die IPAnonymisierung ist auf dieser Website aktiv, so dass Ihre
                      IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen Union
                      oder in anderen Vertragsstaaten des Abkommens über den Europäischen
                      Wirtschaftsraum zuvor gekürzt wird. Nur in Ausnahmefällen wird die volle
                      IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt.
                    </p>
                    <p>
                      In unserem Auftrag wird Google diese Informationen benutzen, um Ihre Nutzung
                      der Website auszuwerten, um Reports über die Websiteaktivitäten
                      zusammenzustellen und um weitere mit der Websitenutzung und der
                      Internetnutzung verbundene Dienstleistungen uns gegenüber zu erbringen. Die im
                      Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird
                      nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung
                      der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software
                      verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall
                      gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden
                      nutzen können. Sie können die Erfassung der durch das Cookie erzeugten und auf
                      Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google
                      sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das
                      unter dem folgenden Link verfügbare Browser-Plugin herunterladen und
                      installieren:
                      <a href='https://www.liebevalo.de/documents/datenschutz'>
                        http://tools.google.com/dlpage/gaoptout?hl=de.
                      </a>
                      Alternativ zum Browser-Plugin oder innerhalb von Browsern auf mobilen Geräten
                      klicken Sie bitte auf den folgenden Link, um ein Opt-Out-Cookie zu setzen, der
                      die Erfassung durch Google Analytics innerhalb dieser Website zukünftig
                      verhindert (dieses Opt-Out-Cookie funktioniert nur in diesem Browser und nur
                      für diese Domain, löschen Sie Ihre Cookies in diesem Browser, müssen Sie
                      diesen Link erneut klicken). &nbsp;
                    </p>
                    <p>
                      {' '}
                      <strong>6. Dauer der Speicherung</strong>
                    </p>
                    <p>
                      Die personenbezogenen Daten werden bei Inaktivität auf unserem Portal maximal
                      30 Tage gespeichert. Bei Nutzeraktivitäten bleiben die Daten ab der Aktion für
                      weitere 30 Tage gespeichert.
                    </p>
                    <p>
                      <strong>7. Betroffenenrechte</strong>
                    </p>
                    <ol>
                      <li>
                        Auskunftsrecht
                        <p>
                          Sie haben das Recht von uns eine Bestätigung darüber zu verlangen, ob Sie
                          betreffende personenbezogene Daten verarbeitet werden. Senden Sie hierfür
                          bitte einfach eine Email an info@liebevalo.de
                        </p>
                      </li>
                      <li>
                        Berichtigung/Löschung/Einschränkung der Verarbeitung
                        <p>
                          Des Weiteren haben Sie das Recht von uns zu verlangen, dass Sie
                          betreffende unrichtige personenbezogene Daten unverzüglich berichtigt
                          werden (Recht auf Berichtigung); Sie betreffende personenbezogene Daten
                          unverzüglich gelöscht werden (Recht auf Löschung) und die Verarbeitung
                          eingeschränkt wird (Recht auf Einschränken der Verarbeitung).
                          <a href='https://www.liebevalo.de/documents/datenschutz'>
                            Senden Sie hierfür bitte einfach eine Email an info@liebevalo.de
                          </a>
                        </p>
                      </li>
                      <li>
                        Recht auf Datenübertragbarkeit
                        <p>
                          Sie haben das Recht, Sie betreffende personenbezogene Daten, die Sie uns
                          bereitgestellt haben, in einem strukturierten, gängigen und
                          maschinenlesbaren Format zu erhalten und diese Daten einem anderen
                          Verantwortlichen zu übermitteln.
                          <a href='https://www.liebevalo.de/documents/datenschutz'>
                            Senden Sie hierfür bitte einfach eine Email an info@liebevalo.de
                          </a>
                        </p>
                      </li>
                      <li>
                        Widerrufsrecht
                        <p>
                          Ist die Verarbeitung Sie betreffender personenbezogener Daten für die
                          Wahrnehmung einer Aufgabe, die im öffentlichen Interesse liegt (Art. 6
                          Abs. 1 Buchst. e) DSGVO) oder zur Wahrung unserer berechtigten Interessen
                          (Art. 6 Abs. 1 Buchst. f) DSGVO) erforderlich, steht Ihnen ein
                          Widerspruchsrecht zu.
                          <a href='https://www.liebevalo.de/documents/datenschutz'>
                            Senden Sie hierfür bitte einfach eine eMail an info@liebevalo.de
                          </a>
                        </p>
                      </li>
                      <li>
                        Widerspruchsrecht
                        <p>
                          Ist die Verarbeitung Sie betreffender personenbezogener Daten für die
                          Wahrnehmung einer Aufgabe, die im öffentlichen Interesse liegt (Art. 6
                          Abs. 1 Buchst. e) DSGVO) oder zur Wahrung unserer berechtigten Interessen
                          (Art. 6 Abs. 1 Buchst. f) DSGVO) erforderlich, steht Ihnen ein
                          Widerspruchsrecht zu.
                          <a href='https://www.liebevalo.de/documents/datenschutz'>
                            Senden Sie hierfür bitte einfach eine eMail an info@liebevalo.de
                          </a>
                        </p>
                      </li>
                      <li>
                        Beschwerderecht
                        <div>
                          x Sind Sie der Ansicht, dass die Verarbeitung der Sie betreffenden
                          personenbezogenen Daten gegen die DSGVO verstößt, haben Sie unbeschadet
                          anderweitiger Rechtsbehelfe das Recht auf Beschwerde bei einer
                          Aufsichtsbehörde
                        </div>
                      </li>
                    </ol>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styled.container}>
          <h2>
            <b>INTRODUCTION</b>
          </h2>
          <div className={styled.bg}>
            <p>
              <b>
                Welcome to the Zizle community! At Zizle , we care about your privacy and trust, so
                this privacy policy (the &quot;Policy&quot;) tells you how we treat your
                information, who we share it with, and what your rights are in relation to that
                information. This policy applies when you use our services through our websites that
                link to this policy, but also our products and applications (including Zizle mobile
                applications, downloadable products and applications, and pages operated by Zizle on
                social networks and other platforms will)
              </b>
            </p>
          </div>
          <p>
            We, the JOOZ YAZILIM BİLİŞİM TEKNOLOJİLERİ DANIŞMANLIK VE TİCARET LİMİTED ŞİRKETİ
            YENİGÜN MAH. MEVLANA CAD. B BLOK NO:54 B/203 – MURATPAŞA / ANTALYA / TÜRKİYE ,
          </p>
          <p>
            eMail: info@zizle.de , take the protection of your personal data very seriously and
            strictly adhere to all applicable laws and regulations on data protection, in particular
            the General Data Protection Regulation (GDPR), the Federal Data Protection Act (BDSG)
            and the Telemedia Act (TMG).
          </p>
          <p>
            The following explanations give you an overview of how we ensure this protection and
            which data we process for which purpose.
          </p>
          <h3>1. Usage Data</h3>
          <p>
            Every time our website is accessed and every time a file is called up, general data
            about this process is automatically saved in a log file. The storage is exclusively for
            system-related and statistical purposes (based on Art. 6 Para. 1 Letter b) GDPR), as
            well as in exceptional cases to report criminal offenses (based on Art. 6 Para. 1 Letter
            e) GDPR).
          </p>
          <p>
            The data will not be passed on to third parties or otherwise evaluated unless there is a
            legal obligation to do so (Article 6 (1) (e) GDPR).
          </p>
          <p>In detail, the following data record is saved for each call:</p>
          <ul>
            <li> Name of retrieved file</li>
            <li> Date and time of retrieval</li>
            <li> amount of data transferred</li>
            <li> Message whether the retrieval was successful</li>
            <li> Description of the type of web browser used</li>
            <li> operating system used</li>
            <li> the previously visited page</li>
            <li> Providers</li>
            <li> IP address of the user</li>
          </ul>
          <h3>2. Personal Data</h3>
          <p>
            Personal data will only be processed by us if we are legally permitted to do so or if
            you have given us your consent.
          </p>
          <p>In detail:</p>
          <ul>
            <li> a) Contact</li>
            <li>
              If you contact us, we store your data on the basis of Art. 6 Para. 1 Letter b) GDPR
              for the purpose of processing your request and in the event that further
              correspondence should take place. All data will be deleted after your request has been
              fully processed. This does not apply to data for which there are statutory or other
              mandatory retention requirements.
            </li>
            <br />
            <li> b) Registration</li>

            <p>We collect the following data as part of the registration process:</p>

            <li>• Nickname</li>
            <li>• Password</li>
            <li>• e-mail address</li>
            <li>• Birth date</li>
            <li>• country</li>
            <li>• POSTCODE</li>
            <li>• Own gender</li>
            <li>• Gender of desired contacts</li>
          </ul>
          <p>
            Your registration can only be completed and sent to us if you have accepted our General
            Terms and Conditions and these data protection regulations and have included them in
            your declaration.
          </p>
          <p>
            After sending this data, you will receive an e-mail from us to the e-mail address you
            provided, in which you must click on a confirmation link to verify the e-mail address
            you provided.
          </p>
          <p>
            The legal basis for this data processing is Art. 6 Para. 1 Letter b) GDPR, or your
            consent upon completion of your registration and thus Art. 6 Para. 1 Letter a) GDPR).
          </p>
          <ul>
            <li>  Payment service providers</li>
            <br />
            <li>When you buy Flirtchips you will be forwarded to Paypal for payment processing</li>
          </ul>
          <p>
            Paypal is a company of PayPal (Europe) S.àr.l. et Cie, SCA22-24 Boulevard Royal, L-2449
            Luxembourg. Your personal data will only be passed on to PayPal, the payment service
            provider involved in contract processing, for the purpose of contract processing. The
            transfer of data is limited to the data required for payment processing (e.g.
            transaction references such as customer number or invoice number). The legal basis for
            this data processing is Art. 6 Para. 1 Letter b) GDPR, or your consent and thus Art. 6
            Para. 1 Letter a) GDPR). Details on data protection at PayPal can be found at:{' '}
            <u>https://www.paypal.com/de/cgibin/marketingweb?cmd=p/gen/ua/policy_privacy-outside</u>
            After the contract has been completed, your data will be blocked for further use and
            deleted after the retention periods under tax and commercial law have expired, unless
            you have expressly consented to further use of your data.
          </p>
          <h3>3. Usage Data</h3>
          <ul>
            <li>
              <p> a) Chat function</p>Your following data will be made accessible to other
              participants so that other participants can contact you via our chat function:
              <p>• Nickname</p>
              <p>• Old</p>
              <p>
                You can make other personal data (e.g. your own profile picture) accessible to other
                participants via your profile.
              </p>
              <p>
                The legal basis for this data processing is Art. 6 Para. 1 Letter b) GDPR, or with
                regard to the personal data you may have made accessible further, your consent and
                thus Art. 6 Para. 1 Letter a) GDPR).
              </p>
            </li>
            <li>
              <p> b) Chat Messages</p>
              <p>
                Messages sent via the chat function are stored by us for the duration of your
                membership.
              </p>
              <br />
            </li>
            <li>
              <p>  Proof of Identity</p>If we request proof of identity from you (e.g. a copy of
              your identity papers), this will only be used for identification purposes and will be
              deleted immediately afterwards. The legal basis for this data processing is Art. 6
              Para. 1 Letter b) GDPR. Data that is not required for identification (such as the
              access number and serial number printed on the ID card) can of course be blacked out
              by you on the copy.
            </li>
          </ul>
          <h3>4.Cookies</h3>
          <p>
            In order to make visiting our website attractive and to enable the use of certain
            functions, we use so-called cookies on various pages. Such file elements can be used to
            identify your computer as a technical unit during your visit to this website in order to
            make it easier for you to use our offer - even on repeat visits.
          </p>
          <p>
            As a rule, however, you have the option of setting your Internet browser in such a way
            that you are informed about the occurrence of cookies, so that you can allow or exclude
            them or delete existing cookies.
          </p>
          <p>
            Please use your internet browser&apos;s help function to obtain information on changing
            these settings. However, some websites - including ours - cannot be used properly
            without cookies, as these files are required for certain processes, such as the chat
            function. We would therefore like to point out that individual functions of our website
            cannot work if you use the have disabled the use of cookies. Cookies do not allow a
            server to read private data from your computer or data stored by another server. They do
            not cause any damage to your computer and do not contain any viruses.
          </p>
          <p>
            We base the use of cookies on Art. 6 Para. 1 Letter f) GDPR: the processing is carried
            out to improve the functionality of our website. It is therefore necessary to safeguard
            our legitimate interests.
          </p>
          <h3>5. Web analysis with Google Analytics</h3>
          <p>
            We use Google Analytics, a web analytics service provided by Google Inc., 1600
            Amphitheater Parkway, Mountain View, CA 94043, USA.
          </p>
          <p>
            Google Analytics uses so-called &quot;cookies&quot;, text files that are stored on your
            computer and that enable an analysis of your use of the website. The information
            generated by the cookie about your use of this website is usually sent to a Google
            server in transferred to the USA and stored there.
          </p>
          <p>
            If IP anonymization is activated on this website, your IP address will be shortened
            beforehand by Google within member states of the European Union or in other contracting
            states of the Agreement on the European Economic Area. Only in exceptional cases will
            the full IP address be sent to a Google server in the USA and shortened there. IP
            anonymization is active on this website, so your IP address will be shortened beforehand
            by Google within member states of the European Union or in other contracting states of
            the Agreement on the European Economic Area. Only in exceptional cases will the full IP
            address be sent to a Google server in the USA and shortened there. On our behalf, Google
            will use this information to evaluate your use of the website, to compile reports on
            website activity and to provide us with other services related to website activity and
            internet usage. The IP address transmitted by your browser as part of Google Analytics
            will not be merged with other Google data. You can prevent the storage of cookies by
            setting your browser software accordingly; we would like to point out to you however
            that in this case you will if applicable not be able to use all functions of this
            website in full. You can prevent the data generated by the cookie and related to your
            use of the website (including your IP address) being sent to Google and the processing
            of this data by Google,
            <u>http://tools.google.com/dlpage/gaoptout?hl=de. </u>As an alternative to the browser
            plugin or within browsers on mobile devices, please click on the following link to set
            an opt-out cookie that will prevent future detection by Google Analytics within this
            website (this opt-out cookie only works in this browser and only for this domain, if you
            delete your cookies in this browser, you have to click this link again).
          </p>
          <p>
            You can find more information on the terms of use and data protection at
            www.google.com/analytics/terms/de.html or at
            www.google.com/intl/de/analytics/privacyoverview.html.
          </p>
          <p>
            We base the use of the aforementioned analysis tool on Art. 6 Para. 1 Letter f) GDPR:
            the processing is carried out to analyze usage behavior and is therefore necessary to
            protect our legitimate interests.
          </p>
          <br />
          <h3>6. Duration of storage</h3>
          <p>
            In the event of inactivity on our portal, personal data is stored for a maximum of 30
            days.
          </p>
          <p>
            In the case of user activities, the data is stored for a further 30 days after the
            action.
          </p>
          <h3>7. Data subject rights</h3>
          <ul>
            <li>
              <p> a. right of providing information</p>
              <p>
                You have the right to request confirmation from us as to whether personal data
                relating to you are being processed.
              </p>
              <p>To do this, simply send an email to info@zizle.de</p>
            </li>
            <li>
              <p> b. Correction/Erasure/Restriction of Processing</p>
              <p>You also have the right to ask us to</p>
              <p>
                • Inaccurate personal data concerning you will be corrected immediately (right to
                correction);
              </p>
              <p>• Personal data concerning you are deleted immediately (right to deletion) and</p>
              <p>• the processing is restricted (right to restriction of processing).</p>
              <u>To do this, simply send an email to info@zizle.de</u>
            </li>
            <li>
              <p> c. Right to data portability</p>
              <p>
                You have the right to receive personal data that you have provided to us in a
                structured, common and machine-readable format and to transmit this data to another
                person responsible.
              </p>
              <u>To do this, simply send an email to info@zizle.de</u>
            </li>
            <li>
              <p> d. right of withdrawal</p>
              <p>
                Is the processing of your personal data for the performance of a task that is in the
                public interest (Art. 6 Para. 1 Letter e) GDPR) or to protect our legitimate
                interests (Art. 6 Para. 1 Letter f) GDPR) necessary, you have the right to object.
              </p>
              <u>To do this, simply send an email to info@zizle.de</u>
            </li>
            <li>
              <p> e. Right to object</p>
              <p>
                Is the processing of your personal data for the performance of a task that is in the
                public interest (Art. 6 Para. 1 Letter e) GDPR) or to protect our legitimate
                interests (Art. 6 Para. 1 Letter f) GDPR) necessary, you have the right to object.
              </p>
              <u>To do this, simply send an email to info@zizle.de</u>
            </li>
            <li>
              <p> f. Right to complain</p>
              <p>
                If you believe that the processing of your personal data violates the GDPR, you have
                the right to lodge a complaint with a supervisory authority without prejudice to any
                other legal remedies
              </p>
            </li>
          </ul>
          <br />
          <br />
        </div> */}
      </div>
      <DataTermImPrintsFooter />
    </div>
  );
};

export default DataProtection;
