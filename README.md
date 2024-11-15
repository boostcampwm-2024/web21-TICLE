<div align='center'>
<h1>TICLE</h1>
실시간 지식 공유 플랫폼
<br/>
<br/>
<img width="600" alt="메인 배너" src="https://github.com/user-attachments/assets/eb4c89c8-6870-4114-bddc-796b51bd7163">
<br/>

### [:ledger: 팀 노션](https://www.notion.so/simeunseo/9-Ticle-12e599a6f0d2804682ccd2251248a435?pvs=4) | [:mag: 위키](https://github.com/boostcampwm-2024/web21-boostproject/wiki) | [🎨 피그마](https://www.figma.com/design/nw74detTvjXGrDP2cfdmwp/TICLE-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=32-4477&t=3FCCnBpgQXMZs63X-1) | [🗓️ 스프린트 백로그](https://github.com/orgs/boostcampwm-2024/projects/82/views/7)

</div>

# 💡 핵심 기능

### **✔️ 실시간 화상 지식 공유**

    카메라와 음성을 통해 발표자와 참여자가 실시간으로 지식을 공유할 수 있습니다.
    화면 공유 기능으로 더욱 효과적인 지식 전달이 가능합니다.

<img width="600" alt="화면공유" src="https://github.com/user-attachments/assets/1e82dd2b-e019-44d8-a85d-12a961de38fc">

### **✔️ 티클 신청 시스템**

    참여자는 티클 리스트에서 원하는 티클을 선택하고 신청할 수 있습니다.
    발표자는 자신의 티클 관리 페이지에서 신청자를 확인하고 발표를 시작할 수 있습니다.

<img width="600" alt="티클 리스트(메인)" src="https://github.com/user-attachments/assets/08449986-eda7-408a-845a-cd21da718837">
<div>
<img width="600" alt="개설한 티클 관리" src="https://github.com/user-attachments/assets/9dc9627e-c806-4560-82d0-a949b1dca153">
<img width="600" alt="신청한 티클 관리" src="https://github.com/user-attachments/assets/81cf68b1-4006-4c05-9984-29d450106b2c">
</div>

### **✔️ 티클 소개 페이지**

    티클 내용과 발표자 정보를 제공합니다.

<img width="600" alt="티클 개설하기" src="https://github.com/user-attachments/assets/566412dc-2045-4260-bfac-309350ac040e">

### **✔️ AI 요약 기능**

    CLOVA API를 이용해 티클 내용을 요약하여 제공합니다.

# 📽️ 스트리밍 구현 흐름

### Producer(미디어 전송 엔드포인트)

<img width="2768" alt="mediasoup sequence diagram - producer" src="https://github.com/user-attachments/assets/8b10a0be-c0c4-4e41-b3a9-462b5fc78be6">

### Consumer(미디어 수신 엔드포인트)

<img width="2768" alt="mediasoup sequence diagram - consumer" src="https://github.com/user-attachments/assets/fd5d2819-bc96-4598-9875-18cb67abb20d">

# ✍️ 학습 정리

| 분야       | 기술                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 공통       | [Turborepo 정리 - 지석호](https://simeunseo.notion.site/Turborepo-0c5bcd0bed0445c4a8c6730b991eefd0?pvs=4) <br/>[패키지 매니저 - 지석호](https://simeunseo.notion.site/12e599a6f0d2816c9ccfe5b9f8743641?pvs=4) <br/> [WebRTC 정리 - 이지은, 황성하](https://simeunseo.notion.site/WebRTC-8c90ccf49d7c4ec5894222aeeb6de5a4?pvs=4) |
| 프론트엔드 | [공통 컴포넌트를 나누는 기준 - 심은서](https://simeunseo.notion.site/139599a6f0d2806b85cdcaefe62ec4ee?pvs=4)<br/> [Tanstack Router로 공통 레이아웃을 가진 중첩 페이지 라우터 구현하기 - 심은서](https://simeunseo.notion.site/Tanstack-Router-136599a6f0d280f9af53ed949671e6bf?pvs=4)                                           |
| 백엔드     | [VPC 설정 - 황성하](https://simeunseo.notion.site/VPC-12bab0d1e2cb4105bc72e528fae7f22f?pvs=4)<br/> [커스텀 에러처리 - 노종빈](https://simeunseo.notion.site/Custom-adabd0f9845c41d6997a522eec7537da?pvs=4) <br/> [Nest.js 환경변수 세팅 - 노종빈](https://simeunseo.notion.site/nest-js-19f20434324f4021bf34b89e9ef2be71?pvs=4)                                                                                                                                                                                                                                  |

#### ↗️ 더 많은 학습 정리 보기

[💭 학습 기록장](https://simeunseo.notion.site/12e599a6f0d2807489d3fc76cbdcaa98?v=12e599a6f0d28130bc68000c718aa85b&pvs=4)
[👾 개발 기록장](https://simeunseo.notion.site/12e599a6f0d280c0a7d9c948983ff80a?v=12e599a6f0d281afa7a4000c474633fc&pvs=4)

# 🛠️ 기술 스택

| 분야       | 기술                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 공통       | ![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)                                                                                                                                            |
| 프론트엔드 | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) |
| 백엔드     | ![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)                                                          |
| 데브옵스   | ![GitHub Actions](https://img.shields.io/badge/githubactions-FF4438?style=for-the-badge&logo=githubactions&logoColor=white) ![Turborepo](https://img.shields.io/badge/turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white) ![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)                     |

# 👋 팀원 소개

<table width="100%">
<tr>
    <td width="20%" align="center"><b>지석호</b></td>
    <td width="20%" align="center"><b>노종빈</b></td>
    <td width="20%" align="center"><b>심은서</b></td>
    <td width="20%" align="center"><b>이지은</b></td>
    <td width="20%" align="center"><b>황성하</b></td>
</tr>
<tr>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/60173534?v=4" width="100" height="100" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/95959567?v=4" width="100" height="100" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/55528304?v=4" width="100" height="100" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/112913242?v=4" width="100" height="100" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/58902013?v=4" width="100" height="100" /></td>
</tr>
<tr>
    <td align="center"><a href="https://github.com/seoko97">@seoko97</a></td>
    <td align="center"><a href="https://github.com/begong313">@begong313</a></td>
    <td align="center"><a href="https://github.com/simeunseo">@simeunseo</a></td>
    <td align="center"><a href="https://github.com/Jieun1ee">@Jieun1ee</a></td>
    <td align="center"><a href="https://github.com/Fixtar">@Fixtar</a></td>
</tr>
<tr>
    <td align="center">Web FE·BE</td>
    <td align="center">Web FE·BE</td>
    <td align="center">Web FE</td>
    <td align="center">Web BE</td>
    <td align="center">Web BE</td>
</tr>
</table>
