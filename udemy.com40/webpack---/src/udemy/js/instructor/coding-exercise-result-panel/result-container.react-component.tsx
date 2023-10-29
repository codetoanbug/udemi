import {onEnterAndSpace} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import classnames from 'classnames';
import {action} from 'mobx';
import {MobXProviderContext, observer, Provider} from 'mobx-react';
import React, {RefObject, useCallback, useContext, useState} from 'react';

import Tabs from 'base-components/tabs/tabs.react-component';
import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';
import {
    AnimatedCollapse,
    AUTO_CLOSE_DISTANCE,
    TRANSITION_DURATION,
} from 'instructor/animated-collapse/animated-collapse.react-component';

import {CodingExerciseResultStore} from './coding-exercise-result.mobx-store';
import {ScrollableContent, ParsedFeedback} from './parsed-feedback.react-component';
import {TestResult} from './types';

import './result-container.less';

const HeaderComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;
    const notificationVisible =
        !store.isEvaluating &&
        (store.hasCheckedSolutionOnce || store.hasPusherFailed || store.evaluationResult);
    return (
        <div styleName="header">
            <Button
                size="medium"
                udStyle="ghost"
                styleName="result-button"
                disabled={!(store.hasCheckedSolutionOnce || store.isOutputEvaluation)}
                onClick={store.toggleResultArea}
            >
                <div styleName="result-status">
                    {gettext('Result')}
                    {notificationVisible && (
                        <Badge
                            styleName={classnames('', {
                                'red-badge': store.notification.color === 'red',
                                'green-badge': store.notification.color === 'green',
                                'orange-badge': store.notification.color === 'orange',
                            })}
                        >
                            {store.notification.status}
                        </Badge>
                    )}
                </div>
                <ArrowLeftIcon
                    styleName={classnames('up', {down: store.resultAreaExpanded})}
                    label={false}
                    size="small"
                />
            </Button>
        </div>
    );
};

const Header = observer(HeaderComponent);

const ContentComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;
    const result = store.evaluationResult;
    const message = store.notification.message;
    if (!result || store.isTimeout)
        return (
            <div styleName="content">
                {message && (
                    <div styleName="message-container">
                        <div className="ud-heading-md">{message.title}</div>
                        <div className="ud-text-md">{message.desc}</div>
                    </div>
                )}
            </div>
        );
    const compileError = !result.success && result.output.test_results.length === 0;
    const isSQL = store.isSQL;
    const sqlCompileError = isSQL && !result.success && result.output.feedback === '';
    return (
        <div styleName="content">
            {compileError || sqlCompileError ? (
                <CompileErrorOutput
                    text={
                        sqlCompileError
                            ? result.output.test_results[0].message
                            : result.output.compile_logs
                    }
                    message={message}
                />
            ) : isSQL ? (
                <ParsedFeedback />
            ) : (
                <TestCasesContainer />
            )}
        </div>
    );
};

const Content = observer(ContentComponent);

const RunCodeResultComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;
    const result = store.runCodeResult;

    const i18n = useI18n();

    const success = result?.success;
    const message = store.notification.message;
    if (!result || store.isTimeout)
        return (
            <div styleName="content">
                {message && (
                    <div styleName="message-container">
                        <div className="ud-heading-md">{message.title}</div>
                        <div className="ud-text-md">{message.desc}</div>
                    </div>
                )}
            </div>
        );
    return (
        <div styleName="output">
            <div styleName="tabs-wrapper">
                <Tabs invertedColors={true} size="small">
                    <Tabs.Tab
                        id="log"
                        title={i18n.gettext('User logs')}
                        renderTabButton={(button) => (
                            <div styleName="tab-user-logs">
                                {button}
                                <UserLogsInfoPopover />
                            </div>
                        )}
                    />
                </Tabs>
            </div>
            <div styleName="content-wrapper">
                <ScrollableContent>
                    {success ? <RunCodeSuccessContent /> : <RunCodeErrorContent />}
                </ScrollableContent>
            </div>
        </div>
    );
};
export const RunCodeResult = observer(RunCodeResultComponent);

const TestCasesContainerCmp: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;

    const onMove = useCallback(
        (event: never, resizeData: {width: number; container: HTMLDivElement}) => {
            const w = Math.max(0, resizeData.width);
            store.setTCPanelWidth?.(w);
        },
        [store],
    );

    return (
        <div styleName="result-area-tests">
            <Resizer
                onMove={onMove}
                onStart={store.onResizerStart}
                onEnd={store.onResizerEnd}
                edges={{right: true}}
                styleName="test-cases-resizer"
                style={{
                    width: store.tcPanelWidth ? `${store.tcPanelWidth}px` : '16.6vw', // according to 12-column grid screen layout, this component gets 2 column width
                }}
            >
                <div styleName="test-cases-drag-handle" />
                <TestCases />
            </Resizer>
            <Output />
        </div>
    );
};

const TestCasesContainer = observer(TestCasesContainerCmp);

const TestCasesComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;
    const testResults = store.evaluationResult?.output.test_results ?? [];
    const failedTestCount = testResults.filter((result) => !result.pass).length;

    const setSelectedTestResult = action((result: TestResult) => {
        store.selectedTestResult = result;
    });

    return (
        <div styleName="test-cases">
            <div styleName="test-cases-inner scroll-color">
                <div styleName="column-view test-cases-header">
                    <div className="ud-text-md ud-text-bold">{gettext('Test Cases')}</div>
                    <div className="ud-text-md">
                        {interpolate(
                            gettext('Failed: %(failed)s, Passed: %(passed)s of %(total)s tests'),
                            {
                                failed: failedTestCount,
                                passed: testResults.length - failedTestCount,
                                total: testResults.length,
                            },
                            true,
                        )}
                    </div>
                </div>
                <div styleName="test-cases-wrapper column-view">
                    {testResults.map((result, idx) => (
                        <div
                            key={idx}
                            styleName={classnames('test-case-row', {
                                selected: store.selectedTestResult?.name === result.name,
                            })}
                        >
                            {result.pass ? (
                                <SuccessIcon
                                    label={false}
                                    size="medium"
                                    styleName="success-icon-color"
                                />
                            ) : (
                                <ErrorIcon
                                    label={false}
                                    size="medium"
                                    styleName="error-icon-color"
                                />
                            )}
                            <div className="ud-text-md">
                                <span
                                    title={result.name}
                                    tabIndex={0}
                                    onKeyPress={onEnterAndSpace(() =>
                                        setSelectedTestResult(result),
                                    )}
                                    role="button"
                                    onClick={() => {
                                        setSelectedTestResult(result);
                                        store.trackEvent('test_case');
                                    }}
                                    styleName="test-case-text"
                                >
                                    {result.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TestCases = observer(TestCasesComponent);

const UserLogsInfoPopover: React.FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return (
        <Popover
            placement="bottom"
            withArrow={true}
            withPadding={true}
            detachFromTarget={true}
            isOpen={isOpen}
            onToggle={setOpen}
            getTriggerRect={(node: HTMLElement) => {
                return (
                    node.firstElementChild?.getBoundingClientRect() ?? node.getBoundingClientRect()
                );
            }}
            trigger={
                <IconButton
                    udStyle={'ghost'}
                    className={'ud-link-neutrals'}
                    styleName={'info-icon-button'}
                >
                    <InfoIcon styleName="info-icon" label={false} size="xsmall" />
                </IconButton>
            }
        >
            <div>
                {gettext(
                    'If you want to generate user logs, write a log statement and click Run tests.',
                )}
            </div>
            <Button
                size="medium"
                styleName="info-popover-dismiss-button"
                onClick={() => setOpen(false)}
            >
                {gettext('Dismiss')}
            </Button>
        </Popover>
    );
};

const OutputComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;
    type TabType = 'result' | 'log';
    const errorCase = store.selectedTestResult && !store.selectedTestResult?.pass;
    const [activeTab, setActiveTab] = useState<TabType>('result');
    return (
        <div styleName="output">
            <div styleName="tabs-wrapper">
                <Tabs
                    invertedColors={true}
                    size="small"
                    activeTabId={activeTab}
                    onSelect={(tabId) => {
                        setActiveTab(tabId as TabType);
                        store.trackEvent(tabId as string);
                    }}
                >
                    <Tabs.Tab id="result" title={gettext('Test result')} />
                    <Tabs.Tab
                        id="log"
                        title={gettext('User logs')}
                        renderTabButton={(button) => (
                            <div styleName="tab-user-logs">
                                {button}
                                <UserLogsInfoPopover />
                            </div>
                        )}
                    />
                </Tabs>
            </div>
            <div styleName="content-wrapper">
                <ScrollableContent>
                    {activeTab === 'result' && (
                        <div>
                            <div styleName="test-result-header">
                                {errorCase ? (
                                    <ErrorIcon
                                        label={false}
                                        styleName="error-icon-color"
                                        size="medium"
                                    />
                                ) : (
                                    <SuccessIcon
                                        label={false}
                                        styleName="success-icon-color"
                                        size="medium"
                                    />
                                )}
                                <div
                                    className="ud-heading-sm"
                                    styleName={
                                        errorCase ? 'error-icon-color' : 'success-icon-color'
                                    }
                                >
                                    {errorCase
                                        ? gettext('Your code failed this test')
                                        : gettext('Your code passed this test')}
                                </div>
                            </div>
                            {errorCase && (
                                <>
                                    <div styleName="error-details" className="ud-heading-md">
                                        {gettext('Error details')}
                                    </div>
                                    <pre
                                        styleName="result-formatted-message"
                                        className="ud-text-md"
                                    >
                                        {store.selectedTestResult?.message}
                                    </pre>
                                </>
                            )}
                        </div>
                    )}
                    {activeTab === 'log' && (
                        <div className="ud-text-md" styleName="result-formatted-message">
                            {store.selectedTestResult?.logs.map((log, i) => (
                                <pre
                                    key={i}
                                    className="ud-text-md"
                                    styleName="result-formatted-message log-text"
                                >
                                    {log}
                                </pre>
                            ))}
                        </div>
                    )}
                </ScrollableContent>
            </div>
        </div>
    );
};

const Output = observer(OutputComponent);

const CompileErrorOutput: React.FC<{text: string; message?: {title: string; desc: string}}> = ({
    text = '',
    message,
}) => {
    return (
        <div styleName="compile-error">
            <ScrollableContent>
                <div styleName="text-wrapper">
                    {message && (
                        <div styleName="message-container message-container-compile-error">
                            <div className="ud-heading-md">{message.title}</div>
                            <div className="ud-text-md">{message.desc}</div>
                        </div>
                    )}
                    <pre styleName="result-formatted-message" className="ud-text-md">
                        {text}
                    </pre>
                </div>
            </ScrollableContent>
        </div>
    );
};

const ResultContainerComponent: React.FC<{
    store: CodingExerciseResultStore;
    workspaceRef: RefObject<HTMLDivElement>;
}> = ({workspaceRef, store}) => {
    const [height, setHeight] = useState<string>(
        store.mainPanelHeight ? `${store.mainPanelHeight}px` : '100%',
    );
    const [heightChanged, setHeightChanged] = useState<boolean>(false);

    const onMove = (event: never, resizeData: {height: number; container: HTMLDivElement}) => {
        if (!store.resultAreaExpanded) return;
        let height = resizeData.height;
        if (height > 40 + AUTO_CLOSE_DISTANCE) {
            if (workspaceRef.current) {
                height = Math.min(workspaceRef.current.clientHeight - 40, height);
                setHeight(`${height}px`);
                store.setPanelHeight?.(height);
                setHeightChanged(true);
            }
        } else {
            store.toggleResultArea();
            setTimeout(() => {
                if (workspaceRef.current) {
                    setHeight('100%');
                    store.setPanelHeight?.(undefined);
                    setHeightChanged(false);
                }
            }, TRANSITION_DURATION);
        }
    };

    return (
        <div styleName="main-wrapper">
            <AnimatedCollapse
                collapsed={!store.resultAreaExpanded}
                collapseDirection="height"
                minHeight={'4.2rem'}
                height={
                    !heightChanged && !store.mainPanelHeight
                        ? '50%'
                        : !store.mainPanelHeight
                        ? undefined
                        : height
                }
            >
                <Resizer
                    styleName={'result-area'}
                    onMove={onMove}
                    onStart={store.onResizerStart}
                    onEnd={store.onResizerEnd}
                    edges={{top: true}}
                    style={{height}}
                >
                    <Provider store={store}>
                        <div
                            styleName={classnames('drag-handle', {
                                'drag-handle-cursor': store.resultAreaExpanded,
                            })}
                        />
                        <Header />
                        <div
                            styleName="result-area-content"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            {store.isOutputEvaluation ? <RunCodeResult /> : <Content />}
                        </div>
                    </Provider>
                </Resizer>
            </AnimatedCollapse>
        </div>
    );
};

export const ResultContainer = observer(ResultContainerComponent);

const RunCodeErrorContentComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;

    const result = store.runCodeResult;
    const i18n = useI18n();

    const compileLogs =
        result?.output.test_results.length !== 0 && result?.output.test_results[0]?.message
            ? result?.output.test_results[0]?.message
            : result?.output.compile_logs;

    return (
        <>
            <div styleName="test-result-header">
                <ErrorIcon label={false} size="medium" styleName="error-icon-color" />
                <span styleName="error-icon-color" className="ud-heading-md">
                    {i18n.gettext('Error')}
                </span>
            </div>
            <>
                <div styleName="runcode-error-details" className="ud-heading-md">
                    {gettext('Error details')}
                </div>
                <pre
                    styleName="result-formatted-message"
                    data-purpose="compile-log"
                    className="ud-text-md"
                >
                    {compileLogs}
                </pre>
            </>
        </>
    );
};
export const RunCodeErrorContent = observer(RunCodeErrorContentComponent);

const RunCodeSuccessContentComponent: React.FC = () => {
    const store = useContext(MobXProviderContext).store as CodingExerciseResultStore;

    const result = store.runCodeResult;
    const i18n = useI18n();

    const output = result?.output.test_results[0].logs;

    return output && output.length > 0 ? (
        <div className="ud-text-md" styleName="result-formatted-message">
            {output?.map((log, i) => (
                <pre key={i} className="ud-text-md" styleName="result-formatted-message log-text">
                    {log}
                </pre>
            ))}
        </div>
    ) : (
        <div>
            <span styleName="success-text-color" className="ud-text-md">
                {i18n.gettext('Run completed.')}
            </span>
        </div>
    );
};
export const RunCodeSuccessContent = observer(RunCodeSuccessContentComponent);
