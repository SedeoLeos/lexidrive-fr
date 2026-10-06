import { test, expect } from "@playwright/test";
async function onboard(page: any) {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Ton prénom" }).fill("Alex");
  await page.getByRole("button", { name: "Entrer dans LexiDrive" }).click();
  await expect(page.getByText("Bonjour, Alex.")).toBeVisible();
}
test("diagnostic complet, correction et persistance du profil", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await onboard(page);
  await page.getByRole("button", { name: "Découvrir mon niveau" }).click();
  for (let i = 0; i < 42; i++) {
    await page.getByRole("radio").first().click();
    await page
      .getByRole("button", {
        name: i === 41 ? "Terminer l’évaluation" : "Valider et continuer",
      })
      .click();
  }
  await expect(page.getByText("SÉANCE TERMINÉE ET SAUVEGARDÉE")).toBeVisible();
  await page.getByRole("button", { name: "Voir ma progression" }).click();
  await expect(page.getByText("Tes compétences")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Bonjour, Alex.")).toBeVisible();
  await page.getByRole("button", { name: "Progression", exact: true }).click();
  await expect(page.getByText("Diagnostic", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `test-results/progression-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("rédaction sauvegardée même après navigation, modèle et relecture", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Entraînement", exact: true }).click();
  await page.getByRole("button", { name: "Rédaction", exact: true }).click();
  await page.getByRole("button", { name: /Un courriel professionnel/ }).click();
  await page
    .getByRole("textbox", { name: "Ma rédaction" })
    .fill(
      "Madame, Monsieur, je souhaite participer à votre atelier de français.",
    );
  await page.getByRole("checkbox").first().click();
  await page
    .getByRole("button", { name: "Découvrir un modèle commenté" })
    .click();
  await expect(page.getByText("Pourquoi cela fonctionne")).toBeVisible();
  await page.getByRole("button", { name: "Accueil", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Entraînement", exact: true }).click();
  await page.getByRole("button", { name: "Rédaction", exact: true }).click();
  await page.getByRole("button", { name: /Un courriel professionnel/ }).click();
  await expect(page.getByRole("textbox", { name: "Ma rédaction" })).toHaveValue(
    /Madame, Monsieur/,
  );
  await expect(page.getByRole("checkbox").first()).toBeChecked();
});
test("lecture, recherche de leçon et dictée audio locale", async ({ page }) => {
  await onboard(page);
  await page.getByRole("button", { name: "Entraînement", exact: true }).click();
  await page
    .getByRole("button", { name: "Lecture orale", exact: true })
    .click();
  await page.getByRole("button", { name: /Le premier pas/ }).click();
  await expect(page.getByText(/Ce matin, Lina ouvre son cahier/)).toBeVisible();
  await page.getByRole("button", { name: "Chronométrer" }).click();
  await expect(
    page.getByRole("button", { name: "Pause", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Leçons", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Rechercher une leçon" })
    .fill("participes");
  await page.getByRole("button", { name: /Les participes passés/ }).click();
  await expect(page.getByText(/Les lettres qu’elle a écrites/)).toBeVisible();
  await page.getByRole("button", { name: "Entraînement", exact: true }).click();
  await page.getByRole("button", { name: "Dictées", exact: true }).click();
  await page.getByRole("button", { name: /On apprend/ }).click();
  await page
    .getByRole("button", { name: "Écouter la dictée", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Ma dictée" })
    .fill(
      "On apprend chaque jour. Les élèves ont ouvert leurs cahiers. Ces exercices sont utiles.",
    );
  await page.getByRole("button", { name: "Comparer ma dictée" }).click();
  await expect(page.getByText("100 %", { exact: true })).toBeVisible();
});
test("les contenus chargés restent accessibles sans réseau", async ({
  page,
  context,
}) => {
  await onboard(page);
  await context.setOffline(true);
  await page.getByRole("button", { name: "Leçons", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Rechercher une leçon" })
    .fill("On ou ont");
  await page.getByRole("button", { name: /On ou ont/ }).click();
  await expect(page.getByText("La règle", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mettre en pratique" }).click();
  await page.getByRole("radio").first().click();
  await page.getByRole("button", { name: "Vérifier ma réponse" }).click();
  await expect(page.getByText("Le réflexe à retenir")).toBeVisible();
});

test("examens blancs par niveau, corrections différées et astuces de remplacement", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Entraînement", exact: true }).click();
  await page
    .getByRole("button", { name: "Les astuces de remplacement et les sons" })
    .click();
  await expect(
    page.getByText("Ils avaient compris.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Les sons on, an, en", exact: true })
    .click();
  await expect(
    page.getByText("Pourquoi « conjugaison » ?", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Entraînement", exact: true }).click();
  await page
    .getByRole("button", { name: "Niveaux et certifications", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explorer les niveaux et certifications" })
    .click();
  await expect(
    page.getByText("Examen blanc C2", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Préparer ce niveau" })
    .first()
    .click();
  await expect(
    page.getByText("13 questions corrigibles", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Commencer les questions" }).click();
  for (let i = 0; i < 13; i++) {
    await page.getByRole("radio").first().click();
    await expect(
      page.getByText("Le réflexe à retenir", { exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("button", {
        name: i === 12 ? "Terminer l’évaluation" : "Valider et continuer",
      })
      .click();
  }
  await page
    .getByRole("button", { name: "Voir les corrections du test" })
    .click();
  await expect(page.getByText(/elle avait un cahier/i)).toBeVisible();
  await page
    .getByRole("button", { name: "Poursuivre : rédaction et expression orale" })
    .click();
  await expect(
    page.getByRole("button", { name: "Rédiger et relire" }),
  ).toBeVisible();
});
test("barre mobile fixe : largeur complète et aucun espace en bas", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await onboard(page);
  const first = await page
    .getByRole("button", { name: "Accueil", exact: true })
    .boundingBox();
  const last = await page
    .getByRole("button", { name: "Progression", exact: true })
    .boundingBox();
  const viewport = page.viewportSize()!;
  expect(first!.x).toBeCloseTo(0, 0);
  expect(last!.x + last!.width).toBeCloseTo(viewport.width, 0);
  expect(first!.y + first!.height).toBeCloseTo(viewport.height, 0);
});
