/* ==========================================================================
   0. 공통 상수 / DOM 참조
   ========================================================================== */
const GITHUB_USERNAME = 'jiheepark1009';
const HEADER_SCROLL_THRESHOLD = 60; // 네비게이션 배경 전환 기준값
const SCROLL_TOP_THRESHOLD = 300; // 맨 위로 버튼 노출 기준값
const REVEAL_THRESHOLD = 0.2; // 스크롤 애니메이션 IntersectionObserver 임계값

const root = document.documentElement;
const header = document.querySelector('#header');
const themeToggle = document.querySelector('#themeToggle');
const navToggle = document.querySelector('#navToggle');
const navMenu = document.querySelector('#navMenu');
const scrollTopBtn = document.querySelector('#scrollTopBtn');

/* ==========================================================================
   1. 다크 모드 토글 (상태: theme → data-theme 속성 + localStorage)
   ========================================================================== */
const applyThemeIcon = (theme) => {
  const icon = themeToggle.querySelector('i');
  icon.classList.toggle('fa-moon', theme !== 'dark');
  icon.classList.toggle('fa-sun', theme === 'dark');
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
};

applyThemeIcon(root.getAttribute('data-theme') || 'light');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  applyThemeIcon(next);
});

/* ==========================================================================
   2. 햄버거 메뉴 토글 + 부드러운 스크롤
   ========================================================================== */
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

const closeMobileMenu = () => {
  navMenu.classList.remove('is-open');
  navToggle.classList.remove('is-active');
  navToggle.setAttribute('aria-expanded', 'false');
};

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId.length <= 1) return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    event.preventDefault();
    closeMobileMenu();
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ==========================================================================
   3. 스크롤 이벤트: 네비게이션 배경 전환 + 맨 위로 버튼 노출
   ========================================================================== */
let isScrollTicking = false;

const handleScroll = () => {
  const scrollY = window.scrollY;
  header.classList.toggle('is-scrolled', scrollY > HEADER_SCROLL_THRESHOLD);
  scrollTopBtn.classList.toggle('is-visible', scrollY > SCROLL_TOP_THRESHOLD);
  isScrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!isScrollTicking) {
    window.requestAnimationFrame(handleScroll);
    isScrollTicking = true;
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

handleScroll();

/* ==========================================================================
   4. Skills 렌더링 (배열 → map으로 카드 HTML 생성)
   ========================================================================== */
const skillCategories = [
  {
    icon: 'fa-solid fa-chart-line',
    title: '데이터 분석 & 통계',
    tags: ['Python', 'Pandas', 'NumPy', 'SQL', '통계 분석'],
  },
  {
    icon: 'fa-solid fa-chart-pie',
    title: '시각화 & 대시보드',
    tags: ['Tableau', 'Power BI', 'Matplotlib', 'Google Data Studio'],
  },
  {
    icon: 'fa-solid fa-futbol',
    title: '스포츠 도메인 지식',
    tags: ['축구(EPL·K리그)', '야구(KBO)', '스포츠 마케팅 전략'],
  },
  {
    icon: 'fa-solid fa-people-arrows',
    title: '협업 & 도구',
    tags: ['Git/GitHub', 'Jupyter Notebook', 'Excel', 'Notion'],
  },
];

const skillsGrid = document.querySelector('#skillsGrid');

const renderSkills = () => {
  skillsGrid.innerHTML = skillCategories
    .map(({ icon, title, tags }) => `
      <article class="skill-card">
        <div class="skill-card__icon"><i class="${icon}" aria-hidden="true"></i></div>
        <h3 class="skill-card__title">${title}</h3>
        <div class="skill-card__tags">
          ${tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
      </article>
    `)
    .join('');
};

renderSkills();

/* ==========================================================================
   5. Featured Projects 렌더링 + 카테고리 필터 (map / filter 활용)
   ========================================================================== */
const featuredProjects = [
  {
    id: 'mkt-1',
    category: 'marketing',
    categoryLabel: '스포츠 마케팅',
    title: '구단 SNS 캠페인 성과 분석',
    description: '시즌 SNS 캠페인 게시물 데이터를 분석해 참여율이 높은 콘텐츠 유형과 발행 시간대를 도출했습니다.',
    image: 'images/thumb-marketing.svg',
    metrics: [
      { label: '참여율 개선', value: '+34%' },
      { label: '분석 게시물', value: '500+' },
      { label: 'ROAS', value: '2.1x' },
    ],
  },
  {
    id: 'mkt-2',
    category: 'marketing',
    categoryLabel: '스포츠 마케팅',
    title: '스포츠 브랜드 소비자 세그먼트 분석',
    description: '설문·구매 데이터를 바탕으로 고객 세그먼트를 나누고 세그먼트별 맞춤 마케팅 전략을 제안했습니다.',
    image: 'images/thumb-marketing.svg',
    metrics: [
      { label: '세그먼트', value: '4개' },
      { label: '표본 수', value: '1,200명' },
      { label: '제안 캠페인', value: '3건' },
    ],
  },
  {
    id: 'data-1',
    category: 'data',
    categoryLabel: '경기 데이터',
    title: 'EPL 득점 예측 모델',
    description: '기대득점(xG) 지표를 활용해 경기별 득점을 예측하는 머신러닝 모델을 만들고 성능을 비교했습니다.',
    image: 'images/thumb-data.svg',
    metrics: [
      { label: '예측 정확도', value: '82%' },
      { label: '분석 경기', value: '380경기' },
      { label: '비교 모델', value: '3종' },
    ],
  },
  {
    id: 'data-2',
    category: 'data',
    categoryLabel: '경기 데이터',
    title: 'KBO 승률 · 관중 수요 예측 대시보드',
    description: '시즌 경기 데이터를 기반으로 팀별 승률 추이와 관중 수요를 예측하는 대시보드를 제작했습니다.',
    image: 'images/thumb-data.svg',
    metrics: [
      { label: '예측 오차', value: '±8%' },
      { label: '분석 구단', value: '10개' },
      { label: '대시보드 지표', value: '12개' },
    ],
  },
];

const featuredGrid = document.querySelector('#featuredGrid');
const filterButtons = document.querySelectorAll('.filter__btn');

const createProjectCard = ({ title, description, image, categoryLabel, metrics }) => `
  <article class="project-card">
    <div class="project-card__thumb">
      <img src="${image}" alt="${title} 프로젝트를 표현한 그래픽" loading="lazy">
    </div>
    <div class="project-card__body">
      <p class="project-card__category">${categoryLabel}</p>
      <h3 class="project-card__title">${title}</h3>
      <p class="project-card__desc">${description}</p>
      <div class="project-card__metrics">
        ${metrics
          .map(({ label, value }) => `
            <div>
              <strong>${value}</strong>
              <span>${label}</span>
            </div>
          `)
          .join('')}
      </div>
    </div>
  </article>
`;

const renderFeaturedProjects = (filter = 'all') => {
  const filtered = filter === 'all'
    ? featuredProjects
    : featuredProjects.filter((project) => project.category === filter);

  featuredGrid.innerHTML = filtered.map(createProjectCard).join('');
};

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderFeaturedProjects(btn.dataset.filter);
  });
});

renderFeaturedProjects();

/* ==========================================================================
   6. GitHub API 연동 (fetch + async/await, 로딩/성공/에러/빈 상태)
   ========================================================================== */
const repoGrid = document.querySelector('#repoGrid');
const repoStatus = document.querySelector('#repoStatus');

const setRepoStatus = (html, isError = false) => {
  repoStatus.innerHTML = html;
  repoStatus.classList.toggle('is-error', isError);
};

const renderSkeleton = () => {
  const placeholders = Array.from({ length: 3 })
    .map(() => '<div class="skeleton-card"></div>')
    .join('');
  repoGrid.innerHTML = `<div class="skeleton-grid">${placeholders}</div>`;
};

const createRepoCard = ({ name, description, html_url: htmlUrl, language, stargazers_count: stars }) => `
  <article class="repo-card">
    <h4 class="repo-card__title">
      <i class="fa-solid fa-code-branch" aria-hidden="true"></i>
      <a href="${htmlUrl}" target="_blank" rel="noopener noreferrer">${name}</a>
    </h4>
    <p class="repo-card__desc">${description || '설명이 등록되지 않은 저장소입니다.'}</p>
    <div class="repo-card__meta">
      <span><i class="fa-solid fa-circle" aria-hidden="true"></i> ${language || '언어 미지정'}</span>
      <span><i class="fa-solid fa-star" aria-hidden="true"></i> ${stars}</span>
    </div>
  </article>
`;

const loadRepos = async () => {
  renderSkeleton();
  setRepoStatus('<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> GitHub 저장소를 불러오는 중입니다...');

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

    if (!response.ok) {
      throw new Error(response.status === 403 ? 'rate-limit' : 'fetch-error');
    }

    const repos = await response.json();

    if (repos.length === 0) {
      repoGrid.innerHTML = '';
      setRepoStatus('<i class="fa-solid fa-box-open" aria-hidden="true"></i> 표시할 프로젝트가 없습니다.');
      return;
    }

    repoGrid.innerHTML = repos.map(createRepoCard).join('');
    setRepoStatus(`<i class="fa-solid fa-circle-check" aria-hidden="true"></i> 총 ${repos.length}개의 저장소를 불러왔습니다.`);
  } catch (error) {
    repoGrid.innerHTML = '';
    const reason = error.message === 'rate-limit' ? ' (API 요청 한도를 초과했습니다)' : '';
    setRepoStatus(`
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      프로젝트를 불러올 수 없습니다.${reason}
      <button class="repo__retry" id="repoRetry" type="button">다시 시도</button>
    `, true);

    document.querySelector('#repoRetry')?.addEventListener('click', loadRepos);
  }
};

loadRepos();

/* ==========================================================================
   7. Contact 폼 유효성 검사 (입력 상태 → 에러 메시지 표시/숨김)
   ========================================================================== */
const contactForm = document.querySelector('#contactForm');
const formSuccess = document.querySelector('#formSuccess');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldRules = {
  name: {
    input: document.querySelector('#name'),
    errorEl: document.querySelector('#nameError'),
    validate: (value) => value.trim().length > 0,
    message: '이름을 입력해주세요.',
  },
  email: {
    input: document.querySelector('#email'),
    errorEl: document.querySelector('#emailError'),
    validate: (value) => EMAIL_REGEX.test(value.trim()),
    message: '올바른 이메일 형식을 입력해주세요.',
  },
  message: {
    input: document.querySelector('#message'),
    errorEl: document.querySelector('#messageError'),
    validate: (value) => value.trim().length > 0,
    message: '문의 내용을 입력해주세요.',
  },
};

const validateField = (key) => {
  const { input, errorEl, validate, message } = fieldRules[key];
  const isValid = validate(input.value);

  input.closest('.form__group').classList.toggle('has-error', !isValid);
  errorEl.textContent = isValid ? '' : message;

  return isValid;
};

Object.keys(fieldRules).forEach((key) => {
  fieldRules[key].input.addEventListener('input', () => {
    validateField(key);
    formSuccess.textContent = '';
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const isFormValid = Object.keys(fieldRules)
    .map(validateField)
    .every(Boolean);

  if (!isFormValid) return;

  const { value: submittedName } = fieldRules.name.input;
  formSuccess.textContent = `${submittedName.trim()}님, 문의가 정상적으로 접수되었습니다. 빠르게 답변드리겠습니다.`;

  contactForm.reset();
  Object.keys(fieldRules).forEach((key) => {
    fieldRules[key].input.closest('.form__group').classList.remove('has-error');
    fieldRules[key].errorEl.textContent = '';
  });
});

/* ==========================================================================
   8. 스크롤 등장 애니메이션 (Intersection Observer)
   ========================================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: REVEAL_THRESHOLD });

revealEls.forEach((el) => revealObserver.observe(el));

/* ==========================================================================
   9. Hero 통계 숫자 카운트업 (스크롤 진입 시 1회 실행)
   ========================================================================== */
const animateCount = (el) => {
  const target = Number(el.dataset.countTo);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  };

  requestAnimationFrame(step);
};

const statEls = document.querySelectorAll('.stat__value[data-count-to]');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statEls.forEach((el) => statObserver.observe(el));

/* ==========================================================================
   10. Footer 연도 자동 반영
   ========================================================================== */
document.querySelector('#year').textContent = new Date().getFullYear();
