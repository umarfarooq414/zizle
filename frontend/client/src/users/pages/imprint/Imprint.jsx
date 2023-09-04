import React from 'react';
import styled from './style.module.css';
import DataTermImPrints from '../../components/dataTermImPrint/DataTermImPrints';
import DataTermImPrintsFooter from '../../components/dataTermImPrintFooter/DataTermImPrintsFooter';
import { Link } from 'react-router-dom';

const Imprint = () => {
  return (
    <>
      <DataTermImPrints />
      <div className={styled.contentBody}>
        <div className={styled.container}>
          <div>
            <div>
              <h2>imprint</h2>
              <span>
                Information according to §5 of the Teleservices Act and the Media State Treaty
              </span>

              <Link to='https://liebevalo.de/'>
                <span>https://liebevalo.de</span>
              </Link>
              <h3>
                <span>is operated by:</span>
              </h3>
              <b>
                <p>JOOZ YAZILIM BİLİŞİM TEKNOLOJİLERİ DANIŞMANLIK VE TİCARET LİMİTED ŞİRKETİ</p>
              </b>
              <b>
                <p>YENİGÜN MAH. MEVLANA CAD. B BLOK NO:54 B/203 – MURATPAŞA</p>
              </b>
              <b>
                <p>ANTALYA / TÜRKİYE</p>
              </b>
              <table>
                <tbody>
                  <tr>
                    <th>
                      <span>Tax number:</span>
                    </th>
                    <td>
                      <span>4841893031</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span>Managing Director:</span>
                    </th>
                    <td>
                      <span>Halit Sari</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span>Jurisdiction:</span>
                    </th>
                    <td>
                      <span>Antalya</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span>E-mail:</span>
                    </th>
                    <td>
                      <span>info@liebevalo.de</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span>Internet</span>
                    </th>
                    <td>
                      <a href='https://liebevalo.de/'>
                        <span>https://liebevalo.de</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2>
                <span>About Us:</span>
              </h2>
              <p>
                <img src='https://www.liebevalo.de/documents/undefined' alt='logo' />
                <span>
                  At Liebevalo you create a personal profile, browse through hundreds of thousands
                  of profiles, receive partner suggestions or go on a playful search.
                </span>
              </p>
              <h2>General terms and conditions of business:</h2>
              <p>You can find our terms of use here.</p>
              <h2>Liability</h2>
              <p>
                The Hamburg Regional Court decided per judgment dated May 12, 1998 - 312 O 85/98 -
                'Liability for Links' that by including a link on ones page, one may also be
                accountable for the content included there. This can only be prevented by expressly
                distancing oneself from this content. We hereby expressly distance ourselves from
                all content on all linked pages on our website and do not adopt this content as our
                own. This declaration applies to all links published on our website and to all
                content of the pages to which the banners and links published by us lead. The
                Service contains links to other Internet sites, resources and members of this
                Service. We are not responsible for the availability of these external resources, or
                their content, which, moreover, we do not necessarily endorse. We are not
                responsible for the content of any advertising, products or other materials on those
                sites.
              </p>

              <p>
                Under no circumstances shall we be responsible or liable, directly or indirectly,
                for any loss or damage allegedly arising from the use of or reliance on any content,
                goods or services on these sites. Any concerns regarding any external link should be
                directed to the appropriate site administrator or webmaster.
              </p>

              <sppan>
                We clearly distance ourselves from any illegal, personality-threatening, morally or
                ethically objectionable content. Please inform us if we should link to such an
                offer.
              </sppan>

              <p>
                All rights, in particular the right of reproduction and distribution as well as
                translation, are reserved. No part of the work may be reproduced in any form (by
                photocopy, microfilm or any other process) or processed, duplicated or distributed
                using electronic media without the written permission of the authors.
              </p>
            </div>
          </div>
        </div>
      </div>
      <DataTermImPrintsFooter />
    </>
  );
};

export default Imprint;
