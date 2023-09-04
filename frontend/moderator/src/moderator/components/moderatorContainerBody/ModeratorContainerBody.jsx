import React from 'react';
import styled from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/fontawesome-free-solid';

export const ModeratorContainerBody = () => {
  return (
    <>
      <div className={styled.moderatorContainerBody}>
        <div className={styled.dateSec}>
          <form>
            <label>Date</label>
            <input type='date' />
            <button>
              <FontAwesomeIcon icon={faReply} />
            </button>
          </form>
        </div>

        <div className={styled.moderatorTeamChecker}>
          <table width='100%' cellSpacing={0} cellPadding={0}>
            <tr>
              <th>Team Take it</th>
              <th>In</th>
              <th>Out</th>
              <th>Ø-Response time</th>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td></td>
            </tr>
          </table>
        </div>
        <br />
        <br />
        <div className={styled.moderatorTimeManagent}>
          <table width='100%' cellSpacing={0} cellPadding={0}>
            <tr>
              <th>Mod</th>
              <th>Coins</th>
              <th>Take it</th>
              <th>Right</th>
              <th>Ins</th>
              <th>Outs</th>
              <th>Ø-Response time</th>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
            <tr>
              <td>Dummy name</td>
              <td>50</td>
              <td>--</td>
              <td>--</td>
              <td>11:00AM</td>
              <td>7:00PM</td>
              <td>--</td>
            </tr>
          </table>
        </div>
        <div className={styled.tableBottomCount}>Showing 25 of results</div>
      </div>
    </>
  );
};
