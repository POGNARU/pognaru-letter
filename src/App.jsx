import { useState } from "react";

const WEB3FORMS_ACCESS_KEY = "18c14f9f-9afa-42d8-8949-9d21d23c23ae";

export default function PognaruSubmission() {
  const [draft, setDraft] = useState("");
  const [concern, setConcern] = useState("");
  const [penName, setPenName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const charCount = draft.length;
  const canSubmit =
    draft.trim().length >= 50 &&
    email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    agreed &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    const now = new Date();
    const timestamp = now.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });

    const formData = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `[원고의 첫 자리] ${penName || "익명"}님의 원고 (${charCount.toLocaleString()}자)`,
      from_name: "원고의 첫 자리 · 포근나루",
      "작가 필명": penName || "(미기재)",
      "작가 이메일": email,
      "접수 일시": timestamp,
      "원고 분량": `${charCount.toLocaleString()}자`,
      "작가 고민": concern.trim() || "(없음)",
      "원고 본문": `\n\n${draft}\n\n`,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(data.message || "전송 실패");
      }
    } catch (e) {
      setError("원고를 맡기는 도중에 문제가 생겼어요. 잠시 후 다시 시도해 주시거나, pognaru@naver.com으로 직접 보내주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDraft(""); setConcern(""); setPenName(""); setEmail("");
    setAgreed(false); setSubmitted(false); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Gowun+Dodum&family=Gowun+Batang:wght@400;700&display=swap');
        body { margin: 0; background: #FAF3EA; }
        textarea:focus, input:focus, button:focus { outline: none; }
        textarea, input { transition: border-color 0.2s; }
        textarea:focus, input:focus { border-color: #C8845A !important; }
        button { transition: all 0.2s; }
        .primary-btn:hover:not(:disabled) { background: #A86B44 !important; }
        .primary-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .ghost-btn:hover:not(:disabled) { background: #F5EBE0 !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .loading-dot { animation: pulse 1.4s ease-in-out infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div style={styles.container}>
        {submitted ? (
          <div className="fade-in" style={styles.completeBox}>
            <div style={styles.completeTag}>원고가 나루터에 도착했습니다</div>
            <h2 style={styles.completeTitle}>포근나루에서<br />당신의 원고를 받았습니다</h2>
            <div style={styles.completeDivider} />
            <p style={styles.completeBody}>
              편집자가 한 편씩 차례로 읽어나가고 있습니다.<br />
              글을 꼼꼼히 읽은 뒤,<br />
              <strong>7일 이내</strong> 알려주신 이메일로 메모를 보내드립니다.<br />
              
            </p>
            <p style={styles.completeSub}>
              기다리시는 동안, 오늘의 첫 문장을 한 줄 더 써 보세요.<br />
              당신의 다음 글을<br />
              우리는 이미 기다리고 있습니다.
            </p>
            <div style={styles.completeFooter}>
              <div style={styles.completeSignature}>— 포근나루의 첫 독자 드림</div>
              <button className="ghost-btn" style={styles.newSubmitBtn} onClick={handleReset}>
                다른 원고를 맡기기
              </button>
            </div>
          </div>
        ) : (
          <>
            <header style={styles.header}>
              <div style={styles.tag}>포근나루 편집자 레터</div>
              <h1 style={styles.title}>원고 띄우기</h1>
              <div style={styles.divider} />
            </header>

            <div style={styles.letterBox}>
              <div style={styles.letterMark}>— 작가님께 —</div>
              <p style={styles.letterP}>
                끝까지 써놓고도<br />
                확신이 서지 않는 글이 있습니다.
              </p>
              <p style={styles.letterP}>
                포근나루는 그 글을 조용히, 끝까지 읽고
                <br />
                느낀 그대로를 메모로 남깁니다.
              </p>
              <p style={styles.letterP}>
                7일 이내, 남겨주신 이메일로 전달됩니다.
              </p>
              <p style={styles.letterPSmall}>
                ✦ 에세이, 수필, 칼럼, 단편소설 등 산문 전반을 받습니다.
                <br />
                ✦ 편집자가 직접 읽고 메모를 작성하며, 필요에 따라 분석 도구를 참고합니다.
                <br />
                ✦ 최종 메모는 사람의 판단과 읽힘을 바탕으로 전달됩니다.
                <br />
                ✦ 무료로 운영되는 포근나루의 작은 서비스입니다.
              </p>
            </div>

            <section style={styles.section}>
              <div style={styles.sectionLabel}>
                <span>원고</span>
                <span style={styles.charCount}>{charCount.toLocaleString()}자</span>
              </div>
              <textarea
                style={styles.draftBox}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="에세이든 소설이든, 완성된 글이든 막 써 내려간 초고든 괜찮습니다. 여기에 붙여 넣어주세요."
              />
              <div style={styles.helperText}>최소 50자 이상 · 최대 2만 자까지 권장</div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionLabel}><span>편집자가 특별히 봐주길 바라는 점 (선택)</span></div>
              <textarea
                style={styles.concernBox}
                value={concern}
                onChange={e => setConcern(e.target.value)}
                placeholder="예: 첫 문장이 너무 흔한 것 같아 걱정돼요. / 전체 리듬을 봐주세요. / 후반부가 갑자기 흐려지는 느낌이에요."
              />
            </section>

            <section style={styles.section}>
              <div style={styles.nameEmailRow}>
                <div style={styles.halfField}>
                  <div style={styles.sectionLabel}><span>필명 (선택)</span></div>
                  <input type="text" style={styles.inputField} value={penName}
                    onChange={e => setPenName(e.target.value)} placeholder="어떻게 불러드릴까요?" />
                </div>
                <div style={styles.halfField}>
                  <div style={styles.sectionLabel}><span>회신받을 이메일 *</span></div>
                  <input type="email" style={styles.inputField} value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
                </div>
              </div>
            </section>

            <section style={styles.agreeSection}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={styles.checkbox} />
                <span>원고는 편집자의 메모 작성 목적으로만 사용되며, 외부에 공개되거나 제3자에게 공유되지 않습니다. 이에 동의합니다.</span>
              </label>
            </section>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.buttonRow}>
              <button className="primary-btn" style={styles.primaryBtn} onClick={handleSubmit} disabled={!canSubmit}>
                {loading ? (
                  <span>원고를 보내는 중<span className="loading-dot">·</span><span className="loading-dot">·</span><span className="loading-dot">·</span></span>
                ) : "원고 맡기기"}
              </button>
            </div>

            <footer style={styles.footer}>
              <div style={styles.footerLine} />
              <div style={styles.footerBrand}>포근한 나루터 · 포근나루</div>
              <div style={styles.footerInfo}>
                문의 | pognaru@naver.com<br />
                인스타그램 | @pognaru_studio
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#FAF3EA", padding: "2.5rem 1rem 4rem", fontFamily: "'Gowun Batang', 'Nanum Myeongjo', serif", color: "#3C2415" },
  container: { maxWidth: "680px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "2.2rem" },
  tag: { display: "inline-block", fontSize: "0.72rem", letterSpacing: "0.3em", color: "#C8845A", fontFamily: "'Gowun Dodum', sans-serif", marginBottom: "1rem", padding: "0.3rem 1rem", border: "1px solid #E4D0B8", borderRadius: "2px" },
  title: { fontFamily: "'Nanum Myeongjo', serif", fontSize: "2.2rem", fontWeight: "700", color: "#3C2415", margin: "0 0 1.2rem", letterSpacing: "-0.02em" },
  divider: { width: "40px", height: "1px", background: "#C8845A", margin: "0 auto" },
  letterBox: { background: "#FFF8ED", border: "1px solid #E4D0B8", borderRadius: "3px", padding: "2.8rem 2.8rem 2.5rem", marginBottom: "2.5rem", boxShadow: "0 3px 14px rgba(200,132,90,0.08)" },
  letterMark: { fontFamily: "'Nanum Myeongjo', serif", fontSize: "1.1rem", color: "#A07A5A", textAlign: "center", marginBottom: "1.5rem", fontStyle: "italic", letterSpacing: "0.1em" },
  letterP: { fontFamily: "'Gowun Batang', serif", fontSize: "1.05rem", lineHeight: "2.2", color: "#3C2415", margin: "0 0 1.1rem", letterSpacing: "-0.005em", textAlign: "center" },
  letterPSmall: { fontFamily: "'Gowun Batang', serif", fontSize: "0.85rem", lineHeight: "2", color: "#6B4C35", margin: "1.7rem 0 0", paddingTop: "1.3rem", borderTop: "1px dashed #D4B896", letterSpacing: "-0.005em" },
  section: { marginBottom: "1.5rem" },
  sectionLabel: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem", fontSize: "0.88rem", color: "#8A6A50", fontFamily: "'Gowun Batang', serif", letterSpacing: "0.05em" },
  charCount: { fontSize: "0.78rem", color: "#B08A6B", fontFamily: "'Gowun Dodum', sans-serif" },
  draftBox: { width: "100%", minHeight: "280px", padding: "1.2rem 1.3rem", border: "1px solid #E4D0B8", borderRadius: "3px", background: "#FEFBF5", fontSize: "0.95rem", fontFamily: "'Gowun Batang', serif", color: "#3C2415", lineHeight: "1.85", boxSizing: "border-box", resize: "vertical" },
  concernBox: { width: "100%", minHeight: "80px", padding: "0.9rem 1rem", border: "1px solid #E4D0B8", borderRadius: "3px", background: "#FFF8ED", fontSize: "0.92rem", fontFamily: "'Gowun Batang', serif", color: "#3C2415", lineHeight: "1.7", boxSizing: "border-box", resize: "vertical" },
  helperText: { fontSize: "0.78rem", color: "#B08A6B", fontFamily: "'Gowun Dodum', sans-serif", marginTop: "0.4rem", letterSpacing: "0.02em" },
  nameEmailRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" },
  halfField: {},
  inputField: { width: "100%", padding: "0.85rem 1rem", border: "1px solid #E4D0B8", borderRadius: "3px", background: "#FEFBF5", fontSize: "0.95rem", fontFamily: "'Gowun Batang', serif", color: "#3C2415", boxSizing: "border-box" },
  agreeSection: { marginTop: "0.5rem", marginBottom: "1.5rem", padding: "1rem 1.1rem", background: "#FFF8ED", border: "1px solid #EDDCC4", borderRadius: "3px" },
  checkboxLabel: { display: "flex", alignItems: "flex-start", gap: "0.7rem", fontSize: "0.85rem", color: "#6B4C35", fontFamily: "'Gowun Batang', serif", lineHeight: "1.7", cursor: "pointer", letterSpacing: "-0.005em" },
  checkbox: { marginTop: "3px", accentColor: "#C8845A", cursor: "pointer", width: "15px", height: "15px" },
  error: { padding: "0.9rem 1.1rem", background: "#F8E5DC", border: "1px solid #E8B8A0", borderRadius: "3px", color: "#A04020", fontSize: "0.9rem", marginBottom: "1rem", fontFamily: "'Gowun Batang', serif", lineHeight: "1.7" },
  buttonRow: { marginTop: "0.5rem" },
  primaryBtn: { width: "100%", padding: "1.1rem 1.5rem", background: "#C8845A", color: "#FFF8ED", border: "none", borderRadius: "3px", fontSize: "1rem", fontFamily: "'Gowun Batang', serif", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" },
  footer: { marginTop: "4rem", textAlign: "center" },
  footerLine: { width: "30px", height: "1px", background: "#D4B896", margin: "0 auto 1.3rem" },
  footerBrand: { fontFamily: "'Nanum Myeongjo', serif", fontSize: "0.9rem", color: "#8A6A50", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "0.6rem" },
  footerInfo: { fontFamily: "'Gowun Batang', serif", fontSize: "0.8rem", color: "#A07A5A", lineHeight: "1.8", letterSpacing: "-0.005em" },
  completeBox: { background: "#FFF8ED", border: "1px solid #E4D0B8", borderRadius: "3px", padding: "3.5rem 2.5rem 2.8rem", textAlign: "center", boxShadow: "0 4px 20px rgba(200,132,90,0.1)", marginTop: "2rem" },
  completeTag: { display: "inline-block", fontSize: "0.72rem", letterSpacing: "0.3em", color: "#C8845A", fontFamily: "'Gowun Dodum', sans-serif", marginBottom: "1.5rem", padding: "0.3rem 1rem", border: "1px solid #C8845A", borderRadius: "2px" },
  completeTitle: { fontFamily: "'Nanum Myeongjo', serif", fontSize: "1.7rem", fontWeight: "700", color: "#3C2415", margin: "0 0 1.8rem", lineHeight: "1.5", letterSpacing: "-0.02em" },
  completeDivider: { width: "40px", height: "1px", background: "#C8845A", margin: "0 auto 1.8rem" },
  completeBody: { fontFamily: "'Gowun Batang', serif", fontSize: "1rem", lineHeight: "2.1", color: "#3C2415", margin: "0 0 2rem", letterSpacing: "-0.005em" },
  completeSub: { fontFamily: "'Nanum Myeongjo', serif", fontSize: "0.92rem", lineHeight: "2", color: "#6B4C35", margin: "0 0 2rem", fontStyle: "italic", letterSpacing: "-0.005em" },
  completeFooter: { paddingTop: "1.5rem", borderTop: "1px dashed #D4B896" },
  completeSignature: { fontFamily: "'Nanum Myeongjo', serif", fontSize: "0.9rem", color: "#8A6A50", fontStyle: "italic", letterSpacing: "0.05em", marginBottom: "1.8rem" },
  newSubmitBtn: { padding: "0.7rem 1.5rem", background: "transparent", color: "#8A6A50", border: "1px solid #D4B896", borderRadius: "3px", fontSize: "0.85rem", fontFamily: "'Gowun Batang', serif", cursor: "pointer" },
};
